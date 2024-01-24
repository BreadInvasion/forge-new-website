from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, desc, select
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    MachineType,
    MachineUsage,
    MaterialGroup,
    MaterialUsageQuantity,
    Semester,
    User,
    Machine,
)
from app.schemas.responses import (
    AllMachineInfoResponse,
    MachineCreateResponse,
    MachineInfo,
    MachineInfoGroup,
    MachineUsageFailureLog,
    MachineUsageFailureLogsResponse,
)
from app.schemas.enums import Permissions
from app.schemas.requests import (
    MachineClearRequest,
    MachineCreateRequest,
    MachineEditRequest,
    MachineFailRequest,
    MachineGetTypeRequest,
    MachineUseRequest,
)

router = APIRouter()


@router.get("/machines")
async def get_machines_list(session: AsyncSession = Depends(deps.get_session)):
    """Get basic info for all machines."""
    # TODO: Show hidden machines if logged in user is admin. @Thomas maybe give a toggle on the page for hidden...? Idk. Hidden state isn't implemented yet anyway. I also need to implement Out of Order

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
            is_failed=False
            if not machine.active_usage
            else machine.active_usage.failed,
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


@router.post("/machines")
async def get_machine():
    """Get detailed information about a machine. Admin only."""
    pass


@router.post("/machines/type")
async def get_type_info(
    request: MachineGetTypeRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_USE_MACHINES})
    ),
):
    # There's definitely a way to do this in one query, but this works
    machine_type_id = await session.scalar(
        select(Machine.type_id).where(Machine.id == request.machine_id)
    )
    if not machine_type_id:
        raise HTTPException(
            status_code=404, detail="Machine with provided ID not found"
        )

    machine_type = await session.scalar(
        select(MachineType)
        .where(MachineType.id == machine_type_id)
        .options(
            selectinload(MachineType.material_inputs).selectinload(
                MaterialGroup.materials
            )
        )
    )

    if not machine_type:
        raise HTTPException(
            status_code=500,
            detail="Query chain lost. Please contact developers for assistance",
        )

    # This should pass all of the info we need, because we loaded the material groups and their respective materials
    return machine_type


@router.post("/machines/use")
async def use_machine(
    request: MachineUseRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_USE_MACHINES})
    ),
):
    """Submit machine usage"""

    if not current_user.active:
        raise HTTPException(
            status_code=403,
            detail="User must be active for the semester to use a machine",
        )

    semester = await session.scalar(select(Semester).where(Semester.active == True))
    if not semester:
        raise HTTPException(
            status_code=400, detail="Cannot use a machine with no active semester"
        )

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
        active=True,
        failed=False,
        cost=cost,
        materials_used=materials_used,
        semester=semester,
    )
    session.add(usage)
    machine.active_usage = usage
    await session.commit()


@router.post("/machines/clear")
async def clear_machine(
    request: MachineClearRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user=Depends(deps.PermittedUserChecker({Permissions.CAN_CLEAR_MACHINES})),
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

    machine.active_usage.active = False
    machine.active_usage.cleared_by = current_user
    machine.active_usage = None

    await session.commit()


@router.post("/machines/fail")
async def fail_machine(
    request: MachineFailRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user=Depends(deps.PermittedUserChecker({Permissions.CAN_FAIL_MACHINES})),
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

    if machine.active_usage.failed == True:
        raise HTTPException(
            status_code=409, detail="Selected machine is already in a failed state"
        )

    machine.active_usage.failed = True
    machine.active_usage.failed_by = current_user
    machine.active_usage.failure_reason = request.reason
    machine.active_usage.failed_at = datetime.now()

    await session.commit()


@router.post("/machines/create", response_model=MachineCreateResponse)
async def create_machine(
    request: MachineCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CREATE_MACHINES})
    ),
):
    conflicting_machine = await session.scalar(
        select(Machine).where(Machine.name == request.name)
    )
    if conflicting_machine:
        raise HTTPException(
            status_code=409, detail="A machine with that name already exists"
        )

    machine_type = await session.scalar(
        select(MachineType).where(MachineType.id == request.type_id)
    )
    if not machine_type:
        raise HTTPException(
            status_code=404, detail="Machine Type with provided ID not found"
        )

    machine = Machine(name=request.name, type=machine_type)
    session.add(machine)
    await session.commit()
    return MachineCreateResponse(machine_id=machine.id)


@router.post("/machines/edit")
async def edit_machine(
    request: MachineEditRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_MACHINES})
    ),
):
    machine = await session.scalar(
        select(Machine).where(Machine.id == request.machine_id)
    )
    if not machine:
        raise HTTPException(
            status_code=404, detail="Machine with provided ID not found"
        )

    if machine.name != request.name:
        conflicting_machine = await session.scalar(
            select(Machine).where(Machine.name == request.name)
        )
        if conflicting_machine:
            raise HTTPException(
                status_code=409, detail="Machine with provided name already exists"
            )
        machine.name = request.name

    if machine.type_id != request.type_id:
        machine_type = await session.scalar(
            select(MachineType).where(MachineType.id == request.type_id)
        )
        if not machine_type:
            raise HTTPException(
                status_code=404, detail="Machine type with provided ID not found"
            )
        machine.type = machine_type

    await session.commit()


@router.get("machines/failed/week")
async def failed_in_last_week(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_VIEW_FAILURE_LOGS})
    ),
):
    earliest_accepted_datetime = datetime.now() - timedelta(days=7)

    # SQL: Select machine usages that HAVE been marked as "failed", timestamped less than a week prior to current time,
    # and sort them with most recent failure timestamp first
    # Joined loading blame for fail tag and ownership of usage.
    usages = list(
        (
            await session.scalars(
                select(MachineUsage)
                .where(
                    MachineUsage.failed == True,
                    MachineUsage.failed_at >= earliest_accepted_datetime,
                )
                .options(joinedload(MachineUsage.failed_by))
                .options(joinedload(MachineUsage.user))
                .options(joinedload(MachineUsage.organization))
                .order_by(desc(MachineUsage.failed_at))
            )
        ).all()
    )

    # Ensures all usages have failure attribution. Should never not be the case,
    # but this serves as a failsafe
    for usage in usages:
        if not usage.failed_by:
            raise ValueError

    usage_dicts = [
        {
            "usage_id": usage.id,
            "user_id": usage.user_id,
            "user_name": None
            if not usage.user
            else usage.user.first_name + " " + usage.user.last_name,
            "organization_id": usage.organization_id,
            "organization_name": None
            if not usage.organization
            else usage.organization.org_name,
            "failed_by_id": usage.failed_by_id,
            "failed_by_name": None  # Placeholder to satisfy type checking, but should never trigger.
            if not usage.failed_by
            else usage.failed_by.first_name + " " + usage.failed_by.last_name,
            "failed_at": usage.failed_at,
            "failure_reason": usage.failure_reason,
        }
        for usage in usages
    ]

    # Filter None values from dictionaries so that the return contents don't have null fields
    usage_dicts = [
        {k: v for k, v in usage.items() if v is not None} for usage in usage_dicts
    ]

    # Convert to pydantic object for response validation
    response_list = [MachineUsageFailureLog(**usage) for usage in usage_dicts]

    return MachineUsageFailureLogsResponse(logs=response_list)
