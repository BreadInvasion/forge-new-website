""" Machine Type endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog
from models.machine import Machine
from models.machine_group import MachineGroup
from schemas.requests import MachineGroupCreateRequest, MachineGroupEditRequest
from schemas.responses import (
    AuditLogModel,
    CreateResponse,
    MachineInfo,
    MachineInfoGroup,
    MachineInfoGroupDetails,
)

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions

router = APIRouter()


@router.post("/machinegroups/new")
async def create_machine_group(
    request: MachineGroupCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_MACHINE_GROUPS}))
    ],
):
    "Create a new machine type with the provided name."

    existing_machine_group = await session.scalar(
        select(MachineGroup).where(MachineGroup.name == request.name)
    )
    if existing_machine_group:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A machine group with that name already exists",
        )

    new_machine_group = MachineGroup(name=request.name, machines=[])
    session.add(new_machine_group)
    await session.commit()
    await session.refresh(new_machine_group)

    audit_log = AuditLog(
        type=LogType.MACHINE_GROUP_DELETED,
        content={
            "machine_group_id": str(new_machine_group.id),
            "user_rcsid": current_user.RCSID,
            "props": request.model_dump(mode="json"),
        },
    )
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=new_machine_group.id)


@router.get("/machinegroups/{group_id}")
async def get_machine_group(
    group_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_GROUPS}))
    ],
):
    "Fetch the machine group with the provided ID."

    machine_group = await session.scalar(
        select(MachineGroup)
        .where(MachineGroup.id == group_id)
        .options(selectinload(MachineGroup.machines).selectinload(Machine.active_usage))
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine group with provided ID not found",
        )

    audit_logs = (
        await session.scalars(
            select(AuditLog)
            .where(AuditLog.content.op("?")("machine_group_id"))
            .order_by(AuditLog.time_created.desc())
        )
    ).all()

    return MachineInfoGroupDetails(
        audit_logs=[AuditLogModel.model_validate(log) for log in audit_logs],
        machine_ids=[machine.id for machine in machine_group.machines],
        num_machines=len(machine_group.machines),
        **machine_group.__dict__,
    )


@router.get("/machinegroups")
async def get_all_machine_groups(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_GROUPS}))
    ],
    limit: int = 20,
    offset: int = 0,
):
    "Fetch all machine groups."

    machine_groups = (
        await session.scalars(
            select(MachineGroup)
            .options(selectinload(MachineGroup.machines))
            .order_by(MachineGroup.name)
            .offset(offset)
            .fetch(limit)
        )
    ).all()

    return [
        MachineInfoGroup(
            machine_ids=[machine.id for machine in machine_group.machines],
            num_machines=len(machine_group.machines),
            **machine_group.__dict__,
        )
        for machine_group in machine_groups
    ]


@router.post("/machinegroups/{group_id}")
async def edit_machine_group(
    group_id: UUID,
    request: MachineGroupEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_MACHINE_GROUPS}))
    ],
):
    """Update the machine group with the provided ID."""

    machine_group = await session.scalar(
        select(MachineGroup)
        .where(MachineGroup.id == group_id)
        .options(selectinload(MachineGroup.machines).selectinload(Machine.active_usage))
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine group with provided ID not found",
        )

    machines = (
        await session.scalars(
            select(Machine).where(Machine.id.in_(request.machine_ids))
        )
    ).all()
    if len(machines) != len(request.machine_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more of the provided machine IDs is invalid",
        )

    differences = {
        "name": request.name if machine_group.name != request.name else None,
        "machine_ids": (
            request.machine_ids
            if set(machine_group.machines) != set(machines)
            else None
        ),
    }

    machine_group.name = request.name
    machine_group.machines = list(machines)

    audit_log = AuditLog(
        type=LogType.MACHINE_GROUP_DELETED,
        content={
            "machine_group_id": str(machine_group.id),
            "user_rcsid": current_user.RCSID,
            "changed_values": differences,
        },
    )
    session.add(audit_log)

    await session.commit()


@router.delete("/machinegroups/{group_id}")
async def delete_machine_group(
    group_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_MACHINE_GROUPS}))
    ],
):
    "Delete the machine group with the provided ID."

    machine_group = await session.scalar(
        select(MachineGroup)
        .where(MachineGroup.id == group_id)
        .options(selectinload(MachineGroup.machines))
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine group with provided ID not found",
        )

    if len(machine_group.machines):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a group that contains machines",
        )

    await session.delete(machine_group)

    audit_log = AuditLog(
        type=LogType.MACHINE_GROUP_DELETED,
        content={
            "machine_group_id": str(machine_group.id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)

    await session.commit()
