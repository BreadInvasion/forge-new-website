from typing import Dict, Set
from uuid import UUID

from sqlalchemy import select

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.role import Role
from models.user import User
from schemas.enums import Permissions


async def get_user_permissions(session: AsyncSession, user_id: UUID):
    user = (
        await session.scalars(
            select(User).where(User.id == user_id).options(selectinload(User.roles))
        )
    ).one()
    permission_set: Dict[Permissions, int] = {}
    for role in user.roles:
        permissions = [Permissions(permission) for permission in role.permissions]
        for permission in permissions:
            if (
                permission not in permission_set
                or permission_set[permission] < role.priority
            ):
                permission_set[permission] = role.priority

        for inverse_permission in role.inverse_permissions:
            if (
                inverse_permission in permission_set
                and permission_set[inverse_permission] < role.priority
            ):
                del permission_set[inverse_permission]

    return set(permission_set.keys())


async def has_permission(
    session: AsyncSession, user_id: UUID, permission: Permissions
) -> bool:
    return permission in await get_user_permissions(session, user_id)


async def has_permissions_all(
    session: AsyncSession, user_id: UUID, permissions: Set[Permissions]
) -> bool:
    return permissions.issubset(await get_user_permissions(session, user_id))


async def has_permissions_any(
    session: AsyncSession, user_id: UUID, permissions: Set[Permissions]
) -> bool:
    user_permissions = await get_user_permissions(session, user_id)
    return any(permission in user_permissions for permission in permissions)
