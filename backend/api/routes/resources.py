""" Resource endpoints. """

from typing import Annotated, Literal
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.orm import InstrumentedAttribute

from models.audit_log import AuditLog
from models.resource import Resource
from schemas.requests import ResourceCreateRequest, ResourceEditRequest
from schemas.responses import (
    AuditLogModel,
    CreateResponse,
    ResourceDetails,
    ResourceInfo,
)

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions

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
                Resource.color == request.color,
                Resource.name == request.name,
                Resource.units == request.units,
            )
        )
    )
    if existing_resource:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A resource with that brand, color, name, units combination already exists",
        )

    new_resource = Resource(
        name=request.name, brand=request.brand, units=request.units, cost=request.cost
    )
    session.add(new_resource)
    await session.commit()
    await session.refresh(new_resource)

    audit_log = AuditLog(
        type=LogType.RESOURCE_CREATED,
        content={
            "resource_id": str(new_resource.id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)
    await session.commit()

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

    audit_logs = (
        await session.scalars(
            select(AuditLog)
            .where(AuditLog.content.op("?")("resource_id"))
            .order_by(AuditLog.time_created.desc())
        )
    ).all()

    return ResourceDetails(
        audit_logs=[AuditLogModel.model_validate(log) for log in audit_logs],
        **resource.__dict__,
    )


@router.get("/resources")
async def get_all_resources(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_RESOURCES}))
    ],
    limit: int = 20,
    offset: int = 0,
    order_by: Literal["name", "brand", "color", "units", "cost"] = "brand",
    descending: bool = False,
):
    "Fetch all resources."

    attr_key_map: dict[str, InstrumentedAttribute] = {
        "name": Resource.name,
        "brand": Resource.brand,
        "color": Resource.color,
        "units": Resource.units,
        "cost": Resource.cost,
    }
    order_determinant = attr_key_map[order_by]
    order_secondary = Resource.name if order_by != "name" else Resource.brand
    order_tertiary = Resource.color if order_by != "color" else Resource.brand
    if descending:
        order_determinant = order_determinant.desc()
        order_secondary = order_secondary.desc()
        order_tertiary = order_tertiary.desc()

    resources = (
        await session.scalars(
            select(Resource)
            .order_by(order_determinant, order_secondary, order_tertiary)
            .offset(offset)
            .fetch(limit)
        )
    ).all()

    return [ResourceInfo(**resource.__dict__) for resource in resources]


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

    differences = {
        "name": request.name if resource.name != request.name else None,
        "brand": request.brand if resource.brand != request.brand else None,
        "units": request.units if resource.units != request.units else None,
        "cost": request.cost if resource.cost != request.cost else None,
    }

    resource.name = request.name
    resource.brand = request.brand
    resource.units = request.units
    resource.cost = request.cost

    audit_log = AuditLog(
        type=LogType.RESOURCE_EDITED,
        content={
            "resource_id": str(resource_id),
            "user_rcsid": current_user.RCSID,
            "changed_values": differences,
        },
    )
    session.add(audit_log)

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

    audit_log = AuditLog(
        type=LogType.RESOURCE_DELETED,
        content={
            "resource_id": str(resource_id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)

    await session.commit()
