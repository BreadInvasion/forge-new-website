from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    MachineType,
    MachineUsage,
    MaterialGroup,
    MaterialUsageQuantity,
    User,
    Machine,
)
from app.schemas.responses import AllMachineInfoResponse, MachineInfo, MachineInfoGroup
from app.schemas.requests import (
    ClearMachineRequest,
    FailMachineRequest,
    MachineUsageRequest,
)
from app.schemas.enums import MachineUsageStatus

router = APIRouter()


@router.get("/machines")
async def get_machines_list(session: AsyncSession = Depends(deps.get_session)):
    machines = set(
        (
            await session.scalars(
                select(Machine).options(
                    joinedload(Machine.type), joinedload(Machine.active_usage)
                )
            )
        ).all()
    )

    machine_groups: Dict[str, List[MachineInfo]] = {}

    for machine in machines:
        machine_info = MachineInfo(
            id=machine.id,
            name=machine.name,
            is_in_use=machine.active_usage is not None,
            usage_status=(
                None if not machine.active_usage else machine.active_usage.status
            ),
        )

        if not machine.type.name in machine_groups:
            machine_groups[machine.type.name] = [machine_info]
        else:
            machine_groups[machine.type.name].append(machine_info)

    return AllMachineInfoResponse(
        groups=[
            MachineInfoGroup(group_name=key, machines=val)
            for key, val in machine_groups.items()
        ]
    )


@router.post("/machines/use")
async def use_machine(
    request: MachineUsageRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.PermittedUserChecker(set(["canUseMachines"]))),
):
    """Submit machine usage"""

    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == request.machine_id)
        .options(
            joinedload(Machine.active_usage),
            joinedload(Machine.type)
            .selectinload(MachineType.material_inputs)
            .selectinload(MaterialGroup.materials),
        )
    )
    if not machine:
        raise HTTPException(status_code=404, detail="Selected machine does not exist")
    if machine.active_usage is not None:
        raise HTTPException(status_code=409, detail="Machine has active usage")

    materials_used: List[MaterialUsageQuantity] = []
    cost = 0

    for slot in machine.type.material_inputs:
        materials_with_slot_id = [
            material for material in request.materials if material.slot_id == slot.id
        ]

        if len(materials_with_slot_id) == 0:
            raise HTTPException(
                status_code=422,
                detail="One or more slots are missing a valid material selection",
            )
        if len(materials_with_slot_id) > 1:
            raise HTTPException(
                status_code=422,
                detail="Tried to select multiple materials for a single input slot",
            )

        material_request = materials_with_slot_id[0]
        material = next(
            (
                material
                for material in slot.materials
                if material.id == material_request.material_id
            ),
            None,
        )
        if not material:
            raise HTTPException(
                status_code=422,
                detail="One or more slots contains an ineligible material",
            )

        if material_request.quantity < 0:
            raise HTTPException(
                status_code=422, detail="Material quantity must be positive"
            )

        materials_used.append(
            MaterialUsageQuantity(
                is_personal_material=material_request.is_own_material,
                material=material,
                quantity=material_request.quantity,
            )
        )

        if not request.is_reprint and not material_request.is_own_material:
            cost += material.cost * material_request.quantity

    usage = MachineUsage(
        user=current_user,
        time_started=datetime.now(),
        time_finished=datetime.now() + timedelta(minutes=request.duration),
        status=MachineUsageStatus.ACTIVE,
        cost=cost,
        materials_used=materials_used,
    )
    session.add(usage)
    machine.active_usage = usage
    await session.commit()


@router.post("machines/clear")
async def clear_machine(
    request: ClearMachineRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user=Depends(deps.PermittedUserChecker(set(["canClearMachines"]))),
):
    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == request.machine_id)
        .options(joinedload(Machine.active_usage))
    )

    if not machine:
        raise HTTPException(status_code=404, detail="Selected machine does not exist")

    if not machine.active_usage:
        raise HTTPException(status_code=409, detail="Selected machine is already clear")

    machine.active_usage.status = MachineUsageStatus.CLEARED
    machine.active_usage.cleared_by = current_user
    machine.active_usage = None

    await session.commit()


@router.post("machines/fail")
async def fail_machine(
    request: FailMachineRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user=Depends(deps.PermittedUserChecker(set(["canFailMachines"]))),
):
    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == request.machine_id)
        .options(joinedload(Machine.active_usage))
    )

    if not machine:
        raise HTTPException(status_code=404, detail="Selected machine does not exist")

    if not machine.active_usage:
        raise HTTPException(
            status_code=409, detail="Selected machine does not have an active usage"
        )

    if machine.active_usage.status == MachineUsageStatus.FAILED:
        raise HTTPException(
            status_code=409, detail="Selected machine is already in a failed state"
        )

    machine.active_usage.status = MachineUsageStatus.FAILED
    machine.active_usage.failed_by = current_user
    machine.active_usage.failure_reason = request.reason
    machine.active_usage.failed_at = datetime.now()

    await session.commit()
