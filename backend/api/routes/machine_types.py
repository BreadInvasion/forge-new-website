""" Machine Type endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.machine import Machine
from models.machine_type import MachineType
from models.resource_slot import ResourceSlot
from schemas.requests import MachineTypeCreateRequest, MachineTypeEditRequest
from schemas.responses import CreateResponse, MachineTypeInfo, ResourceInfo, ResourceSlotInfo

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


@router.get("/machinetypes/{type_id}")
async def get_machine_type(
    type_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_TYPES}))
    ],
):
    "Fetch the machine type with the provided ID."

    machine_type = await session.scalar(
        select(MachineType)
        .where(MachineType.id == type_id)
        .options(selectinload(MachineType.resource_slots).subqueryload(ResourceSlot.valid_resources))
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine type with provided ID not found",
        )

    return MachineTypeInfo(
        id=machine_type.id,
        name=machine_type.name,
        resource_slots=[
            ResourceSlotInfo(
                id=resource_slot.id,
                db_name=resource_slot.db_name,
                display_name=resource_slot.display_name,
                valid_resources=[
                    ResourceInfo(
                        id=resource.id,
                        name=resource.name,
                        units=resource.units,
                        brand=resource.brand,
                        cost=resource.cost
                    ) for resource in resource_slot.valid_resources
                ],
                allow_own_material=resource_slot.allow_own_material,
                allow_empty=resource_slot.allow_empty
            )
            for resource_slot in machine_type.resource_slots
        ],
    )


@router.get("/machinetypes")
async def get_all_machine_types(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_TYPES}))
    ],
):
    "Fetch all machine types."

    machine_types = (
        await session.scalars(
            select(MachineType).options(selectinload(MachineType.resource_slots).subqueryload(ResourceSlot.valid_resources))
        )
    ).all()

    return [
        MachineTypeInfo(
            id=machine_type.id,
            name=machine_type.name,
            resource_slots=[
                ResourceSlotInfo(
                    id=resource_slot.id,
                    db_name=resource_slot.db_name,
                    display_name=resource_slot.display_name,
                    valid_resources=[
                        ResourceInfo(
                            id=resource.id,
                            name=resource.name,
                            units=resource.units,
                            brand=resource.brand,
                            cost=resource.cost
                        ) for resource in resource_slot.valid_resources
                    ],
                    allow_own_material=resource_slot.allow_own_material,
                    allow_empty=resource_slot.allow_empty
                )
                for resource_slot in machine_type.resource_slots
            ],
        )
        for machine_type in machine_types
    ]


@router.post("/machinetypes/edit")
async def edit_machine_type(
    request: MachineTypeEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_MACHINE_TYPES}))
    ],
):
    """Update the machine type with the provided ID."""

    machine_type = await session.scalar(
        select(MachineType)
        .where(MachineType.id == request.type_id)
        .options(selectinload(MachineType.resource_slots).subqueryload(ResourceSlot.valid_resources))
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine type with provided ID not found",
        )

    resource_slots = (
        await session.scalars(
            select(ResourceSlot).where(ResourceSlot.id.in_(request.resource_slot_ids))
        )
    ).all()
    if len(resource_slots) != len(request.resource_slot_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more of the provided resource slot IDs is invalid",
        )

    machine_type.name = request.name
    machine_type.resource_slots = list(resource_slots)
    await session.commit()


@router.delete("/machinetypes/{type_id}")
async def delete_machine_type(
    type_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_MACHINE_TYPES}))
    ],
):
    "Delete the machine type with the provided ID."

    machine_type = await session.scalar(
        select(MachineType)
        .where(MachineType.id == type_id)
    )
    if not machine_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine type with provided ID not found",
        )

    machines = (await session.scalars(select(Machine).where(Machine.type_id == machine_type.id))).all()
    if len(machines):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a type that is in use",
        )

    await session.delete(machine_type)
    await session.commit()