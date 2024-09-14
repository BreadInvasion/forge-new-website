""" Machine Type endpoints. """

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from models.machine_type import MachineType
from models.resource_slot import ResourceSlot
from schemas.requests import MachineTypeCreateRequest
from schemas.responses import CreateResponse

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import Permissions

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
    return CreateResponse(id=new_machine_type.id)
