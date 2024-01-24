from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    MachineType,
    MachineUsage,
    Material,
    MaterialGroup,
    MaterialUsageQuantity,
    User,
    Machine,
)
from app.schemas.responses import AllMachineInfoResponse, MachineInfo, MachineInfoGroup
from app.schemas.requests import (
    MaterialCreateRequest,
    MaterialEditRequest,
    MaterialDeleteRequest,
    MaterialGroupCreateRequest,
    MaterialGroupEditRequest,
    MaterialGroupDeleteRequest,
)
from app.schemas.enums import Permissions

router = APIRouter()


@router.get("/materialgroups")
async def get_all_material_groups(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_SEE_MATERIAL_GROUPS})
    ),
):
    material_groups = list(
        (
            await session.scalars(
                select(MaterialGroup).options(selectinload(MaterialGroup.materials))
            )
        ).all()
    )
    return [
        {
            "group_id": group.id,
            "name": group.name,
            "materials": [
                {
                    "material_id": material.id,
                    "name": material.name,
                    "units": material.units,
                    "cost": material.cost,
                }
                for material in group.materials
            ],
        }
        for group in material_groups
    ]


@router.post("/materialgroups/create")
async def create_material_group(
    request: MaterialGroupCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CREATE_MATERIAL_GROUPS})
    ),
):
    conflicting_group = await session.scalar(
        select(MaterialGroup).where(MaterialGroup.name == request.name)
    )
    if conflicting_group:
        raise HTTPException(
            status_code=409, detail="Material Group with provided name already exists"
        )

    materials = list(
        (
            await session.scalars(
                select(Material).where(Material.id.in_(request.material_ids))
            )
        ).all()
    )
    if len(materials) != len(request.material_ids):
        raise HTTPException(
            status_code=404,
            detail="One or more of the provided material IDs could not be found",
        )

    # We want to preserve the provided order so it appears how they arranged it on the frontend
    materials_ordered = [
        next(material for material in materials if material.id == material_id)
        for material_id in request.material_ids
    ]
    material_group = MaterialGroup(name=request.name, materials=materials_ordered)
    session.add(material_group)
    await session.commit()


@router.post("/materialgroups/edit")
async def edit_material_group(
    request: MaterialGroupEditRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_MATERIAL_GROUPS})
    ),
):
    material_group = await session.scalar(
        select(MaterialGroup).where(MaterialGroup.id == request.group_id)
    )
    if not material_group:
        raise HTTPException(
            status_code=404, detail="Material Group with provided ID not found"
        )

    if material_group.name != request.name:
        conflicting_group = await session.scalar(
            select(MaterialGroup).where(MaterialGroup.name == request.name)
        )
        if conflicting_group:
            raise HTTPException(
                status_code=409,
                detail="Material Group with provided name already exists",
            )
        material_group.name = request.name

    materials = list(
        (
            await session.scalars(
                select(Material).where(Material.id.in_(request.material_ids))
            )
        ).all()
    )
    if len(materials) != len(request.material_ids):
        raise HTTPException(
            status_code=404,
            detail="One or more of the provided material IDs could not be found",
        )
    materials_ordered = [
        next(material for material in materials if material.id == material_id)
        for material_id in request.material_ids
    ]
    material_group.materials = materials_ordered
    await session.commit()


@router.post("/materialgroups/delete")
async def delete_material_group(
    request: MaterialGroupDeleteRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_DELETE_MATERIAL_GROUPS})
    ),
):
    material_group = await session.scalar(
        select(MaterialGroup).where(MaterialGroup.id == request.group_id)
    )
    if not material_group:
        raise HTTPException(
            status_code=404, detail="Material Group with provided ID not found"
        )

    machine_type = await session.scalar(
        select(MachineType).where(MachineType.material_inputs.contains(material_group))
    )
    if machine_type:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete material group while it is being used by at least one machine type",
        )

    await session.delete(material_group)
    await session.commit()
