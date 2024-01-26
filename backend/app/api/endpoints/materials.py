from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import joinedload
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
    MaterialGetRequest,
)
from app.schemas.enums import Permissions

router = APIRouter()


@router.get("/materials")
async def get_all_materials(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_SEE_MATERIALS})
    ),
):
    materials = list((await session.scalars(select(Material))).all())
    return [
        {
            "material_id": material.id,
            "name": material.name,
            "units": material.units,
            "cost": material.cost,
        }
        for material in materials
    ]


@router.post("/materials")
async def get_material(
    request: MaterialGetRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_SEE_MATERIALS})
    ),
):
    material = await session.scalar(
        select(Material).where(Material.id == request.material_id)
    )
    if not material:
        raise HTTPException(
            status_code=404, detail="Material with provided ID not found"
        )
    return {
        "material_id": material.id,
        "name": material.name,
        "cost": material.cost,
        "units": material.units,
    }


@router.post("/materials/create")
async def create_material(
    request: MaterialCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CREATE_MATERIALS})
    ),
):
    conflicting_material = await session.scalar(
        select(Material).where(
            Material.name == request.name, Material.units == request.units
        )
    )
    if conflicting_material:
        raise HTTPException(
            status_code=409,
            detail="Material with provided name and units already exists",
        )

    material = Material(name=request.name, cost=request.cost, units=request.units)
    session.add(material)
    await session.commit()
    return material.id


@router.post("/materials/edit")
async def edit_material(
    request: MaterialEditRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_MATERIALS})
    ),
):
    material = await session.scalar(
        select(Material).where(Material.id == request.material_id)
    )
    if not material:
        raise HTTPException(
            status_code=404, detail="Material with provided ID not found"
        )

    conflicting_material = await session.scalar(
        select(Material).where(
            Material.name == request.name,
            Material.units == request.units,
            Material.id != request.material_id,
        )
    )
    if conflicting_material:
        raise HTTPException(
            status_code=409,
            detail="Cannot change material name and units to be identical to the name and units of another Material",
        )

    material.name = request.name
    material.units = request.units
    material.cost = request.cost
    await session.commit()


@router.post("/materials/delete")
async def delete_material(
    request: MaterialDeleteRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_DELETE_MATERIALS})
    ),
):
    material = await session.scalar(
        select(Material).where(Material.id == request.material_id)
    )
    if not material:
        raise HTTPException(
            status_code=404, detail="Material with provided ID not found"
        )
