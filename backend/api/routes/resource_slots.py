""" Resource Slot endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog
from models.resource import Resource
from models.resource_slot import ResourceSlot
from models.resource_usage_quantity import ResourceUsageQuantity
from schemas.requests import ResourceSlotCreateRequest, ResourceSlotEditRequest
from schemas.responses import CreateResponse, ResourceSlotInfo, ResourceSlotDetails

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions

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

    audit_log = AuditLog(type=LogType.RESOURCE_SLOT_CREATED, content={
        "resource_slot_id": str(new_resource_slot.id),
        "user_rcsid": current_user.RCSID,
        "props": request.model_dump(mode="json"),
    })
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=new_resource_slot.id)

@router.get("/resourceslots/{resource_slot_id}")
async def get_resource_slot(
    resource_slot_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_RESOURCE_SLOTS}))
    ],
):
    "Fetch the resource slot with the provided ID."

    resource_slot = await session.scalar(
        select(ResourceSlot)
        .where(ResourceSlot.id == resource_slot_id)
        .options(selectinload(ResourceSlot.valid_resources))
    )
    if not resource_slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource Slot with provided ID not found",
        )
    
    audit_logs = (await session.scalars(
        select(AuditLog).where(AuditLog.content.op("?")("resource_slot_id")).order_by(AuditLog.time_created.desc())
    )).all()

    return ResourceSlotDetails(
        audit_logs=list(audit_logs),
        valid_resource_ids=[resource.id for resource in resource_slot.valid_resources],
        **resource_slot.__dict__,
    )


@router.get("/resourceslots")
async def get_all_resource_slots(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_RESOURCE_SLOTS}))
    ],
):
    "Fetch all resource slots."

    resource_slots = (
        await session.scalars(
            select(ResourceSlot).options(selectinload(ResourceSlot.valid_resources))
        )
    ).all()

    return [
        ResourceSlotInfo(
            valid_resource_ids=[resource.id for resource in resource_slot.valid_resources],
            **resource_slot.__dict__,
        )
        for resource_slot in resource_slots
    ]


@router.post("/resourceslots/{resource_slot_id}")
async def edit_resource_slot(
    resource_slot_id: UUID,
    request: ResourceSlotEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_RESOURCE_SLOTS}))
    ],
):
    """Update the resource slot with the provided ID."""

    resource_slot = await session.scalar(select(ResourceSlot).where(ResourceSlot.id == resource_slot_id).options(selectinload(ResourceSlot.valid_resources)))
    if not resource_slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource Slot with provided ID not found",
        )
    
    valid_resources = (await session.scalars(select(Resource).where(Resource.id.in_(request.resource_ids)))).all()
    
    differences = {
        "db_name": request.db_name if resource_slot.db_name != request.db_name else None,
        "display_name": request.display_name if resource_slot.display_name != request.display_name else None,
        "valid_resource_ids": request.resource_ids if set(resource_slot.valid_resources) != set(valid_resources) else None,
        "allow_own_material": request.allow_own_material if resource_slot.allow_own_material != request.allow_own_material else None,
        "allow_empty": request.allow_empty if resource_slot.allow_empty != request.allow_empty else None,
    }

    resource_slot.db_name = request.db_name
    resource_slot.display_name = request.display_name
    resource_slot.valid_resources = list(valid_resources)
    resource_slot.allow_empty = request.allow_empty
    resource_slot.allow_own_material = request.allow_own_material

    audit_log = AuditLog(type=LogType.RESOURCE_SLOT_EDITED, content={
        "resource_slot_id": str(resource_slot.id),
        "user_rcsid": current_user.RCSID,
        "changed_values": differences,
    })
    session.add(audit_log)

    await session.commit()


@router.delete("/resourceslots/{resource_slot_id}")
async def delete_resource_slot(
    resource_slot_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_RESOURCE_SLOTS}))
    ],
):
    "Delete the resource slot with the provided ID."

    resource_slot = await session.scalar(select(ResourceSlot).where(ResourceSlot.id == resource_slot_id))
    if not resource_slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource Slot with provided ID not found",
        )

    await session.delete(resource_slot)

    audit_log = AuditLog(
        type=LogType.RESOURCE_SLOT_DELETED,
        content={
            "resource_slot_id": str(resource_slot.id),
            "user_rcsid": current_user.RCSID
        }
    )
    session.add(audit_log)

    await session.commit()
