""" Resource endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select

from models.resource import Resource
from schemas.requests import ResourceCreateRequest, ResourceEditRequest
from schemas.responses import CreateResponse, ResourceInfo

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


@router.get("/resources/{resource_id}")
async def get_resource(
    resource_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_RESOURCES}))
    ],
):
    "Fetch the resource with the provided ID."

    resource = await session.scalar(select(Resource).where(Resource.id == resource_id))
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource with provided ID not found",
        )

    return ResourceInfo(
        id=resource.id,
        name=resource.name,
        units=resource.units,
        brand=resource.brand,
        cost=resource.cost,
    )


@router.get("/resources")
async def get_all_resources(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_RESOURCES}))
    ],
):
    "Fetch all resources."

    resources = (await session.scalars(select(Resource))).all()

    return [
        ResourceInfo(
            id=resource.id,
            name=resource.name,
            units=resource.units,
            brand=resource.brand,
            cost=resource.cost,
        )
        for resource in resources
    ]


@router.post("/resources/{resource_id}")
async def edit_resource(
    resource_id: UUID,
    request: ResourceEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_RESOURCES}))
    ],
):
    """Update the resource with the provided ID."""

    resource = await session.scalar(select(Resource).where(Resource.id == resource_id))
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource with provided ID not found",
        )

    resource.name = request.name
    resource.brand = request.brand
    resource.units = request.units
    resource.cost = request.cost
    await session.commit()


@router.delete("/resources/{resource_id}")
async def delete_resource(
    resource_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_RESOURCES}))
    ],
):
    "Delete the resource with the provided ID."

    resource = await session.scalar(select(Resource).where(Resource.id == resource_id))
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource with provided ID not found",
        )

    await session.delete(resource)
    await session.commit()
