""" Role endpoints. """

from typing import Annotated, Literal
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.orm import InstrumentedAttribute

from models.role import Role, UserRoleAssociation
from models.audit_log import AuditLog
from schemas.enums import Permissions, LogType
from schemas.responses import CreateResponse, AuditLogModel, RoleInfo, RoleDetails
from schemas.requests import RoleCreateRequest, RoleEditRequest
from ..deps import DBSession, PermittedUserChecker
from models.user import User

router = APIRouter()


@router.post("/roles/new")
async def create_role(
    request: RoleCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_ROLES}))
    ],
):
    """Create a new role with the provided properties."""

    existing_role = await session.scalar(
        select(Role).where(Role.name == request.name)
    )
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A role with that name already exists",
        )
    
    valid_permissions = [perm.value for perm in Permissions]
    permissions = sorted([perm for perm in request.permissions if perm in valid_permissions])
    inverse_permissions = sorted([perm for perm in request.inverse_permissions if perm in valid_permissions])
    if len(permissions) != len(request.permissions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more permissions are invalid",
        )
    if len(inverse_permissions) != len(request.inverse_permissions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more inverse permissions are invalid",
        )

    new_role = Role(
        name=request.name,
        permissions=permissions,
        inverse_permissions=inverse_permissions,
        display_role=request.display_role,
        role_icon_name=None,
        priority=request.priority,
    )
    session.add(new_role)
    await session.commit()
    await session.refresh(new_role)

    audit_log = AuditLog(
        type=LogType.ROLE_CREATED,
        content={
            "role_id": str(new_role.id),
            "user_rcsid": current_user.RCSID,
            "props": request.model_dump(mode="json"),
        },
    )
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=new_role.id)


@router.get("/roles/{role_id}")
async def get_role(
    role_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_ROLES}))
    ],
):
    """Fetch the role with the provided ID."""
    
    role = await session.scalar(select(Role).where(Role.id == role_id))
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role with provided ID not found",
        )
    audit_logs = (
        await session.scalars(
            select(AuditLog)
            .where(
                and_(
                    AuditLog.content.has_key("role_id"),
                    AuditLog.content["role_id"].astext == str(role_id),
                )
            )
            .order_by(AuditLog.time_created.desc())
        )
    ).all()

    return RoleDetails(
        audit_logs=[AuditLogModel.model_validate(log) for log in audit_logs],
        **role.__dict__,
    )


@router.get("/roles")
async def get_all_roles(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_ROLES}))
    ],
    limit: int = 20,
    offset: int = 0,
    order_by: Literal[
        "name",
        "priority",
    ] = "name",
    descending: bool = False,
):
    """Fetch all roles."""

    attr_key_map: dict[str, InstrumentedAttribute] = {
        "name": Role.name,
        "priority": Role.priority,
    }
    order_determinant = attr_key_map[order_by]
    if descending:
        order_determinant = order_determinant.desc()

    roles = (
        await session.scalars(
            select(Role)
            .order_by(order_determinant)
            .offset(offset)
            .fetch(limit)
        )
    ).all()
    
    return [
        RoleInfo(
            **role.__dict__
        )
        for role in roles
    ]


@router.post("/roles/{role_id}")
async def edit_role(
    role_id: UUID,
    request: RoleEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_ROLES}))
    ],
):
    """Update the role with the provided ID."""
    
    role = await session.scalar(select(Role).where(Role.id == role_id))
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role with provided ID not found",
        )

    valid_permissions = [perm.value for perm in Permissions]
    permissions = sorted([perm for perm in request.permissions if perm in valid_permissions])
    inverse_permissions = sorted([perm for perm in request.inverse_permissions if perm in valid_permissions])
    if len(permissions) != len(request.permissions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more permissions are invalid",
        )
    if len(inverse_permissions) != len(request.inverse_permissions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more inverse permissions are invalid",
        )

    differences = {
        "name": request.name if role.name != request.name else None,
        "permissions": permissions if role.permissions != permissions else None,
        "inverse_permissions": inverse_permissions if role.inverse_permissions != inverse_permissions else None,
        "display_role": request.display_role if role.display_role != request.display_role else None,
        "role_icon_name": None if role.role_icon_name is not None else None,
        "priority": request.priority if role.priority != request.priority else None,
    }

    role.name = request.name
    role.permissions = permissions
    role.inverse_permissions = inverse_permissions
    role.display_role = request.display_role
    role.role_icon_name = None
    role.priority = request.priority

    audit_log = AuditLog(
        type=LogType.ROLE_EDITED,
        content={
            "role_id": str(role.id),
            "user_rcsid": current_user.RCSID,
            "changed_values": differences,
        },
    )
    session.add(audit_log)

    await session.commit()


@router.delete("/roles/{role_id}")
async def delete_role(
    role_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_ROLES}))
    ],
):
    """Delete the role with the provided ID."""

    role = await session.scalar(select(Role).where(Role.id == role_id))
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role with provided ID not found",
        )

    users = (
        await session.scalars(
            select(UserRoleAssociation).where(UserRoleAssociation.role_id == role.id)
        )
    ).all()
    if len(users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a role that is assigned to users",
        )

    await session.delete(role)

    audit_log = AuditLog(
        type=LogType.ROLE_DELETED,
        content={"role_id": str(role.id), "user_rcsid": current_user.RCSID},
    )
    session.add(audit_log)

    await session.commit()
