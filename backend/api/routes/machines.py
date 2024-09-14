""" Machine endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.machine import Machine
from models.machine_group import MachineGroup
from models.machine_type import MachineType
from schemas.requests import MachineCreateRequest, MachineEditRequest
from schemas.responses import CreateResponse, MachineInfo

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import Permissions

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
    return CreateResponse(id=new_machine.id)


@router.get("/machines/{machine_id}")
async def get_machine(
    machine_id: UUID,
    session: DBSession,
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

    return MachineInfo(
        id=machine.id,
        name=machine.name,
        is_in_use=machine.active_usage is not None,
        is_failed=(machine.active_usage.failed if machine.active_usage else False),
    )


@router.get("/machines")
async def get_all_machines(
    session: DBSession,
):
    "Fetch all machines."

    machines = (
        await session.scalars(
            select(Machine).options(selectinload(Machine.active_usage))
        )
    ).all()

    return [
        MachineInfo(
            id=machine.id,
            name=machine.name,
            is_in_use=machine.active_usage is not None,
            is_failed=(machine.active_usage.failed if machine.active_usage else False),
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

    type = await session.scalar(
        select(MachineType).where(MachineType.id == request.type_id)
    )
    group = await session.scalar(
        select(MachineGroup).where(MachineGroup.id == request.group_id)
    )

    if not type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Machine type with provided ID not found",
        )

    if not group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Machine group with provided ID not found",
        )

    machine.name = request.name
    machine.type = type
    machine.group = group
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

    await session.delete(machine)
    await session.commit()
