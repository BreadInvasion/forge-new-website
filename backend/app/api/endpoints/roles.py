from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select, update
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    MachineType,
    MachineUsage,
    MaterialGroup,
    MaterialUsageQuantity,
    Organization,
    Role,
    Semester,
    User,
    Machine,
)
from app.schemas.responses import AllMachineInfoResponse, MachineInfo, MachineInfoGroup
from app.schemas.requests import (
    MaterialCreateRequest,
    MaterialEditRequest,
    MaterialDeleteRequest,
    RoleCreateRequest,
    RoleDeleteRequest,
    RoleEditRequest,
    SemesterCreateRequest,
)
from app.schemas.enums import RESTRICTED_PERMISSIONS, Permissions, SemesterType
from app.api import utils

router = APIRouter()


@router.post("/roles/create")
async def create_role(
    request: RoleCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CREATE_ROLES})
    ),
):
    conflicting_role = await session.scalar(
        select(Role).where(Role.name == request.name)
    )
    if conflicting_role:
        raise HTTPException(
            status_code=409, detail="Role with provided name already exists"
        )

    if any(
        restricted_permission in (request.permissions + request.inverse_permissions)
        for restricted_permission in RESTRICTED_PERMISSIONS
    ) and not await utils.has_permission(
        session, current_user.id, Permissions.IS_SUPERUSER
    ):
        raise HTTPException(
            status_code=403,
            detail="Only superusers can create roles with IS_SUPERUSER, ROLE_CHANGE_IMMUNE, and LOCKOUT",
        )

    role = Role(
        name=request.name,
        permissions=request.permissions,
        inverse_permissions=request.inverse_permissions,
        display_role=request.display_role,
        priority=request.priority,
    )
    session.add(role)
    await session.commit()


@router.post("/roles/edit")
async def edit_role(
    request: RoleEditRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_ROLES})
    ),
):
    role = await session.scalar(select(Role).where(Role.id == request.role_id))
    if not role:
        raise HTTPException(status_code=404, detail="Role with provided ID not found")

    if request.name != role.name:
        conflicting_role = await session.scalar(
            select(Role).where(Role.name == request.name, Role.id != request.role_id)
        )
        if conflicting_role:
            raise HTTPException(
                status_code=409, detail="Role with provided name already exists"
            )

    if any(
        restricted_permission
        in (
            request.permissions
            + request.inverse_permissions
            + role.permissions
            + role.inverse_permissions
        )
        for restricted_permission in RESTRICTED_PERMISSIONS
    ) and not await utils.has_permission(
        session, current_user.id, Permissions.IS_SUPERUSER
    ):
        raise HTTPException(
            status_code=403,
            detail="Only superusers can modify roles containing IS_SUPERUSER, ROLE_CHANGE_IMMUNE, and LOCKOUT",
        )

    role = Role(
        name=request.name,
        permissions=request.permissions,
        inverse_permissions=request.inverse_permissions,
        display_role=request.display_role,
        priority=request.priority,
    )
    session.add(role)
    await session.commit()


@router.post("/roles/delete")
async def delete_role(
    request: RoleDeleteRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_ROLES})
    ),
):
    role = await session.scalar(select(Role).where(Role.id == request.role_id))
    if not role:
        raise HTTPException(status_code=404, detail="Role with provided ID not found")

    if any(
        restricted_permission in (role.permissions + role.inverse_permissions)
        for restricted_permission in RESTRICTED_PERMISSIONS
    ) and not utils.has_permission(session, current_user.id, Permissions.IS_SUPERUSER):
        raise HTTPException(
            status_code=403,
            detail="Only superusers can delete roles containing IS_SUPERUSER, ROLE_CHANGE_IMMUNE, and LOCKOUT",
        )
