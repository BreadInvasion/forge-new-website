""" Machine endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog
from models.machine import Machine
from models.machine_group import MachineGroup
from models.machine_type import MachineType
from models.machine_usage import MachineUsage
from schemas.requests import MachineCreateRequest, MachineEditRequest
from schemas.responses import CreateResponse, MachineDetails, MachineInfo

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions

router = APIRouter()


@router.post("/machines/new")
async def create_machine(
    request: MachineCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_MACHINES}))
    ],
):
    existing_machine = await session.scalar(
        select(Machine).where(Machine.name == request.name)
    )
    if existing_machine:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A machine with that name already exists",
        )

    machine_type = await session.scalar(
        select(MachineType).where(MachineType.id == request.type_id)
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not find a machine type with the provided id",
        )

    machine_group = await session.scalar(
        select(MachineGroup).where(MachineGroup.id == request.group_id)
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not find a machine group with the provided id",
        )

    new_machine = Machine(name=request.name, type=machine_type, group=machine_group)
    session.add(new_machine)
    await session.commit()
    await session.refresh(new_machine)

    audit_log = AuditLog(type=LogType.MACHINE_CREATED, content={
        "machine_id": str(new_machine.id),
        "user_rcsid": current_user.RCSID,
        "props": request.model_dump(mode="json"),
    })
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=new_machine.id)


@router.get("/machines/{machine_id}")
async def get_machine(
    machine_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINES}))
    ],
):
    "Fetch the machine with the provided ID."

    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == machine_id)
        .options(selectinload(Machine.active_usage))
    )
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine with provided ID not found",
        )
    
    audit_logs = (await session.scalars(
        select(AuditLog).where(AuditLog.content.op("?")("machine_id")).order_by(AuditLog.time_created.desc())
    )).all()

    return MachineDetails(
        audit_logs=list(audit_logs),
        machine_usage_id=(machine.active_usage.id if machine.active_usage else None),
        **machine.__dict__,
    )


@router.get("/machines")
async def get_all_machines(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINES}))
    ],
):
    "Fetch all machines."

    machines = (
        await session.scalars(
            select(Machine).options(selectinload(Machine.active_usage))
        )
    ).all()

    return [
        MachineInfo(
            machine_usage_id=(machine.active_usage.id if machine.active_usage else None),
            **machine.__dict__,
        )
        for machine in machines
    ]


@router.post("/machines/{machine_id}")
async def edit_machine(
    machine_id: UUID,
    request: MachineEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_MACHINES}))
    ],
):
    """Update the machine with the provided ID."""

    machine = await session.scalar(select(Machine).where(Machine.id == machine_id))
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine with provided ID not found",
        )

    machine_type = await session.scalar(
        select(MachineType).where(MachineType.id == request.type_id)
    )

    group: MachineGroup | None = None
    if request.group_id:
        group = await session.scalar(
            select(MachineGroup).where(MachineGroup.id == request.group_id)
        )

    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Machine type with provided ID not found",
        )

    if not group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Machine group with provided ID not found",
        )
    
    differences = {
        "name":  request.name     if machine.name != request.name         else None,
        "type_id":  request.type_id  if machine.type.id != request.type_id   else None,
        "group_id": request.group_id if (machine.group.id if machine.group else None) != request.group_id else None,
        "disabled": request.disabled if machine.disabled != request.disabled else None,
        "maintenance_mode": request.maintenance_mode if machine.maintenance_mode != request.maintenance_mode else None,
    }

    machine.name = request.name
    machine.type = machine_type
    machine.group = group
    machine.maintenance_mode = request.maintenance_mode
    machine.disabled = request.disabled

    audit_log = AuditLog(type=LogType.MACHINE_EDITED, content={
        "machine_id": str(machine.id),
        "user_rcsid": current_user.RCSID,
        "changed_values": differences,
    })
    session.add(audit_log)

    await session.commit()


@router.delete("/machines/{machine_id}")
async def delete_machine(
    machine_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_MACHINES}))
    ],
):
    "Delete the machine with the provided ID."

    machine = await session.scalar(select(Machine).where(Machine.id == machine_id))
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine with provided ID not found",
        )

    usages = (
        await session.scalars(
            select(MachineUsage).where(MachineUsage.machine_id == machine.id)
        )
    ).all()
    if len(usages):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can't delete a machine with usages",
        )

    await session.delete(machine)

    audit_log = AuditLog(
        type=LogType.MACHINE_DELETED,
        content={
            "machine_id": str(machine.id),
            "user_rcsid": current_user.RCSID
        }
    )
    session.add(audit_log)

    await session.commit()
