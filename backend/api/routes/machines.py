""" Machine endpoints. """

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from models.machine import Machine
from models.machine_group import MachineGroup
from models.machine_type import MachineType
from schemas.requests import MachineCreateRequest
from schemas.responses import CreateResponse

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
