""" Machine Type endpoints. """

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from models.machine_group import MachineGroup
from schemas.requests import MachineGroupCreateRequest
from schemas.responses import CreateResponse

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import Permissions

router = APIRouter()


@router.post("/machinegroups/new")
async def create_machine_group(
    request: MachineGroupCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_MACHINE_TYPES}))
    ],
):
    "Create a new machine type with the provided name and resource slots."

    existing_machine_group = await session.scalar(
        select(MachineGroup).where(MachineGroup.name == request.name)
    )
    if existing_machine_group:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A machine group with that name already exists",
        )

    new_machine_group = MachineGroup(name=request.name)
    session.add(new_machine_group)
    await session.commit()
    await session.refresh(new_machine_group)
    return CreateResponse(id=new_machine_group.id)
