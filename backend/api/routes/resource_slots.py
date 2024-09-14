""" Resource Slot endpoints. """

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from models.resource import Resource
from models.resource_slot import ResourceSlot
from schemas.requests import ResourceSlotCreateRequest
from schemas.responses import CreateResponse

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import Permissions

router = APIRouter()


@router.post("/resourceslots/new")
async def create_resource_slot(
    request: ResourceSlotCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_RESOURCE_SLOTS}))
    ],
):
    "Create a new resource slot with the provided configuration."

    existing_resource_slot = await session.scalar(
        select(ResourceSlot).where(ResourceSlot.db_name == request.db_name)
    )
    if existing_resource_slot:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A resource with that internal name already exists",
        )

    resources = (
        await session.scalars(
            select(Resource).where(Resource.id.in_(request.resource_ids))
        )
    ).all()
    if len(resources) != len(request.resource_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not find all of the provided resources",
        )

    new_resource_slot = ResourceSlot(
        db_name=request.db_name,
        display_name=request.display_name,
        valid_resources=resources,
        allow_own_material=request.allow_own_material,
        allow_empty=request.allow_empty,
    )
    session.add(new_resource_slot)
    await session.commit()
    await session.refresh(new_resource_slot)
    return CreateResponse(id=new_resource_slot.id)
