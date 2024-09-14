""" Resource endpoints. """

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select

from models.resource import Resource
from schemas.requests import ResourceCreateRequest
from schemas.responses import CreateResponse

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import Permissions

router = APIRouter()


@router.post("/resources/new")
async def create_resource(
    request: ResourceCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_RESOURCES}))
    ],
):
    "Create a new resource object with the provided information."

    existing_resource = await session.scalar(
        select(Resource).where(
            and_(
                Resource.brand == request.brand,
                Resource.name == request.name,
                Resource.units == request.units,
            )
        )
    )
    if existing_resource:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A resource with that brand, name, units combination already exists",
        )

    new_resource = Resource(
        name=request.name, brand=request.brand, units=request.units, cost=request.cost
    )
    session.add(new_resource)
    await session.commit()
    await session.refresh(new_resource)
    return CreateResponse(id=new_resource.id)
