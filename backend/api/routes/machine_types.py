""" Machine Type endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog
from models.machine import Machine
from models.machine_type import MachineType
from models.resource_slot import ResourceSlot
from schemas.requests import MachineTypeCreateRequest, MachineTypeEditRequest
from schemas.responses import (
    AuditLogModel,
    CreateResponse,
    MachineTypeDetails,
    MachineTypeInfo,
    ResourceInfo,
    ResourceSlotInfo,
)

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions

router = APIRouter()


@router.post("/machinetypes/new")
async def create_machine_type(
    request: MachineTypeCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_MACHINE_TYPES}))
    ],
):
    "Create a new machine type with the provided name and resource slots."

    existing_machine_type = await session.scalar(
        select(MachineType).where(MachineType.name == request.name)
    )
    if existing_machine_type:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A machine type with that name already exists",
        )

    resource_slots = (
        await session.scalars(
            select(ResourceSlot).where(ResourceSlot.id.in_(request.resource_slot_ids))
        )
    ).all()
    if len(resource_slots) != len(request.resource_slot_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not find all of the provided resource slots",
        )

    new_machine_type = MachineType(name=request.name, resource_slots=resource_slots)
    session.add(new_machine_type)
    await session.commit()
    await session.refresh(new_machine_type)

    audit_log = AuditLog(
        type=LogType.MACHINE_TYPE_CREATED,
        content={
            "machine_type_id": str(new_machine_type.id),
            "user_rcsid": current_user.RCSID,
            "props": request.model_dump(mode="json"),
        },
    )
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=new_machine_type.id)


@router.get("/machinetypes/{type_id}")
async def get_machine_type(
    type_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_TYPES}))
    ],
):
    "Fetch the machine type with the provided ID."

    machine_type = await session.scalar(
        select(MachineType)
        .where(MachineType.id == type_id)
        .options(
            selectinload(MachineType.resource_slots).selectinload(
                ResourceSlot.valid_resources
            )
        )
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine type with provided ID not found",
        )

    audit_logs = (
        await session.scalars(
            select(AuditLog)
            .where(AuditLog.content.op("?")("machine_type_id"))
            .order_by(AuditLog.time_created.desc())
        )
    ).all()

    num_machines = (
        await session.scalar(
            select(func.count())
            .select_from(Machine)
            .where(Machine.type_id == machine_type.id)
        )
    ) or 0

    return MachineTypeDetails(
        audit_logs=[AuditLogModel.model_validate(log) for log in audit_logs],
        resource_slot_ids=[
            resource_slot.id for resource_slot in machine_type.resource_slots
        ],
        resource_names={
            resource.name
            for slot in machine_type.resource_slots
            for resource in slot.valid_resources
        },
        num_machines=num_machines,
        **machine_type.__dict__,
    )


@router.get("/machinetypes")
async def get_all_machine_types(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_TYPES}))
    ],
    limit: int = 20,
    offset: int = 0,
):
    "Fetch all machine types."

    machine_types = (
        await session.scalars(
            select(MachineType)
            .options(
                selectinload(MachineType.resource_slots).selectinload(
                    ResourceSlot.valid_resources
                )
            )
            .order_by(MachineType.name)
            .offset(offset)
            .fetch(limit)
        )
    ).all()

    num_machines_result = (
        await session.execute(
            select(Machine.type_id, func.count(Machine.type_id)).group_by(
                Machine.type_id
            )
        )
    ).all()
    num_machines = {item[0]: item[1] for item in num_machines_result}

    return [
        MachineTypeInfo(
            resource_slot_ids=[
                resource_slot.id for resource_slot in machine_type.resource_slots
            ],
            resource_names={
                resource.name
                for slot in machine_type.resource_slots
                for resource in slot.valid_resources
            },
            num_machines=num_machines.get(machine_type.id, 0),
            **machine_type.__dict__,
        )
        for machine_type in machine_types
    ]


@router.post("/machinetypes/{type_id}")
async def edit_machine_type(
    type_id: UUID,
    request: MachineTypeEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_MACHINE_TYPES}))
    ],
):
    """Update the machine type with the provided ID."""

    machine_type = await session.scalar(
        select(MachineType)
        .where(MachineType.id == type_id)
        .options(
            selectinload(MachineType.resource_slots).selectinload(
                ResourceSlot.valid_resources
            )
        )
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine type with provided ID not found",
        )

    resource_slots = (
        await session.scalars(
            select(ResourceSlot).where(ResourceSlot.id.in_(request.resource_slot_ids))
        )
    ).all()
    if len(resource_slots) != len(request.resource_slot_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more of the provided resource slot IDs is invalid",
        )

    differences = {
        "name": request.name if machine_type.name != request.name else None,
        "resource_slots": (
            request.resource_slot_ids
            if set(machine_type.resource_slots) != set(resource_slots)
            else None
        ),
    }

    machine_type.name = request.name
    machine_type.resource_slots = list(resource_slots)

    audit_log = AuditLog(
        type=LogType.MACHINE_TYPE_EDITED,
        content={
            "machine_type_id": str(machine_type.id),
            "user_rcsid": current_user.RCSID,
            "changed_values": differences,
        },
    )
    session.add(audit_log)

    await session.commit()


@router.delete("/machinetypes/{type_id}")
async def delete_machine_type(
    type_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_MACHINE_TYPES}))
    ],
):
    "Delete the machine type with the provided ID."

    machine_type = await session.scalar(
        select(MachineType).where(MachineType.id == type_id)
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine type with provided ID not found",
        )

    machines = (
        await session.scalars(select(Machine).where(Machine.type_id == machine_type.id))
    ).all()
    if len(machines):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a type that is in use",
        )

    await session.delete(machine_type)

    audit_log = AuditLog(
        type=LogType.MACHINE_TYPE_DELETED,
        content={
            "machine_type_id": str(machine_type.id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)

    await session.commit()
