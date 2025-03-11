from decimal import Decimal
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from models.audit_log import AuditLog
from models.machine_usage import MachineUsage
from schemas.responses import MachineUsageSchema, ResourceInfo, ResourceSlotSchema

from ..utils import has_permissions_any
from models.machine import Machine
from models.machine_type import MachineType
from models.resource_slot import ResourceSlot
from models.resource_usage_quantity import ResourceUsageQuantity
from models.state import State
from schemas.requests import MachineUsageRequest

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions

from sqlalchemy import select
from sqlalchemy.orm import selectinload

router = APIRouter()


@router.get("/use/{machine_id}/schema")
async def get_usage_schema(
    machine_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_USE_MACHINES}))
    ],
):
    """Retrieve the relevant information for using the machine with the provided ID."""

    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == machine_id)
        .options(selectinload(Machine.group))
        .options(
            selectinload(Machine.type)
            .selectinload(MachineType.resource_slots)
            .selectinload(ResourceSlot.valid_resources)
        )
        .options(selectinload(Machine.active_usage))
    )

    if not machine or (
        machine.disabled
        and not has_permissions_any(
            session,
            current_user.id,
            {Permissions.CAN_EDIT_MACHINES, Permissions.IS_SUPERUSER},
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine with provided ID not found",
        )

    return MachineUsageSchema(
        group_name=machine.group.name if machine.group else None,
        type_name=machine.type.name,
        resource_slots=[
            ResourceSlotSchema.model_validate(
                {
                    **slot.__dict__,
                    "resource_slot_id": slot.id,
                    "valid_resources": [
                        ResourceInfo.model_validate(resource.__dict__)
                        for resource in slot.valid_resources
                    ],
                }
            )
            for slot in machine.type.resource_slots
        ],
        **machine.__dict__,
    )


@router.post("/use/{machine_id}")
async def use_a_machine(
    machine_id: UUID,
    request: MachineUsageRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_USE_MACHINES}))
    ],
):
    """Log a machine usage for the provided machine ID."""

    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == machine_id)
        .options(
            selectinload(Machine.type)
            .selectinload(MachineType.resource_slots)
            .selectinload(ResourceSlot.valid_resources)
        )
        .options(selectinload(Machine.active_usage))
    )

    can_edit_machines_permissions = await has_permissions_any(
            session,
            current_user.id,
            {Permissions.CAN_EDIT_MACHINES, Permissions.IS_SUPERUSER},
        )

    if not machine or (
        machine.disabled
        and not can_edit_machines_permissions
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine with provided ID not found",
        )

    if machine.active_usage:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Machine is in use",
        )

    current_semester = await session.scalar(
        select(State.active_semester).options(selectinload(State.active_semester))
    )
    
    between_semesters_permission = await has_permissions_any(
        session=session,
        user_id=current_user.id,
        permissions={
            Permissions.CAN_USE_MACHINES_BETWEEN_SEMESTERS,
            Permissions.IS_SUPERUSER,
        },
    )
    
    if not current_semester and not between_semesters_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to log machine usages between semesters",
        )
        
    required_resource_slot_ids = {
        resource_slot.id
        for resource_slot in machine.type.resource_slots
        if not resource_slot.allow_empty
    }
    all_resource_slot_ids = {
        resource_slot.id for resource_slot in machine.type.resource_slots
    }

    # Check that required resource slot ids is subset of the provided resource slots
    if not required_resource_slot_ids <= request.resource_usages.keys():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more required resource slots not populated",
        )

    # Check that no non-existent slots were provided
    if not request.resource_usages.keys() <= all_resource_slot_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more provided resource slots not found",
        )
        
    resource_usage_quantities: list[ResourceUsageQuantity] = []
    total_cost = 0

    total_cost += round(
        Decimal(request.duration_seconds / 3600) * (machine.type.cost_per_hour), 2
    )
    
    print("DEBUG LINE 1: ", total_cost)

    for resource_slot_id, usage_info in request.resource_usages.items():
        resource_slot = next(
            resource_slot
            for resource_slot in machine.type.resource_slots
            if resource_slot.id == resource_slot_id
        )
        valid_resources = resource_slot.valid_resources

        resource_used = next(
            (
                resource
                for resource in valid_resources
                if resource.id == usage_info.resource_id
            ),
            None,
        )
        if not resource_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Resource ID {usage_info.resource_id} not found",
            )

        if usage_info.is_own_material and not resource_slot.allow_own_material:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Resource Slot {resource_slot_id} is marked as own material but cannot be",
            )

        resource_usage_quantities.append(
            ResourceUsageQuantity(
                resource=resource_used,
                is_own_material=usage_info.is_own_material,
                amount=usage_info.amount,
                cpu_at_usage=resource_used.cost,
            )
        )

        if not usage_info.is_own_material:
            print("DEBUG LINE 2: ", usage_info.amount, resource_used.cost)
            total_cost += usage_info.amount * resource_used.cost

    print("DEBUG LINE 3: ", total_cost)

    machine_usage = MachineUsage(
        machine=machine,
        semester=current_semester,
        user=current_user,
        duration_seconds=request.duration_seconds,
        cost=total_cost,
        resources_used=resource_usage_quantities,
    )
    machine.active_usage = machine_usage

    session.add(machine_usage)
    session.add(machine)
    await session.commit()
    await session.refresh(machine_usage)
    
    audit_log = AuditLog(
        type=LogType.MACHINE_USED,
        content={
            "machine_usage_id": str(machine_usage.id),
            "user_rcsid": current_user.RCSID,
            "props": request.model_dump(mode="json"),
        },
    )
    session.add(audit_log)
    await session.commit()
