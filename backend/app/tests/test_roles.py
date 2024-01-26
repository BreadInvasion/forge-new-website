from typing import Dict
from httpx import AsyncClient, codes
from sqlalchemy import any_, select

from app.main import app
from app.models import Role, User
from app.tests.conftest import default_user_headers
from app.schemas.enums import Permissions

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


async def test_missing_permissions(
    client: AsyncClient,
    default_user: User,
    default_user_headers: Dict[str, str],
):
    response = await client.post(
        app.url_path_for("create_role"),
        headers=default_user_headers,
        json={
            "name": "Jail",
            "permissions": [Permissions.LOCKOUT],
            "inverse_permissions": [],
            "display_role": False,
            "priority": 1000,
        },
    )
    assert response.status_code == codes.FORBIDDEN
    assert response.json()["detail"] == "User lacks required permissions"


async def test_has_superuser(
    client: AsyncClient,
    default_superuser: User,
    default_user_headers: Dict[str, str],
    session: AsyncSession,
):
    response = await client.post(
        app.url_path_for("create_role"),
        headers=default_user_headers,
        json={
            "name": "Jail",
            "permissions": [Permissions.LOCKOUT],
            "inverse_permissions": [],
            "display_role": False,
            "priority": 1000,
        },
    )
    assert response.status_code == codes.OK
    assert (
        (
            await session.scalar(
                select(Role.name).where(
                    Role.permissions.contains([Permissions.LOCKOUT])
                )
            )
        )
    ) == "Jail"


async def test_permission_overwrite(
    client: AsyncClient,
    default_superuser: User,
    default_user_headers: Dict[str, str],
    session: AsyncSession,
):
    superjail = Role(
        name="Superjail",
        permissions=set(),
        inverse_permissions={Permissions.IS_SUPERUSER},
        priority=10000,
        display_role=False,
    )
    session.add(superjail)
    default_superuser = (
        await session.scalars(
            select(User)
            .where(User.id == default_superuser.id)
            .options(selectinload(User.roles))
        )
    ).one()
    default_superuser.roles.append(superjail)
    await session.commit()

    response = await client.post(
        app.url_path_for("create_role"),
        headers=default_user_headers,
        json={
            "name": "Jail",
            "permissions": [Permissions.LOCKOUT],
            "inverse_permissions": [],
            "display_role": False,
            "priority": 1000,
        },
    )
    assert response.status_code == codes.FORBIDDEN
    assert response.json()["detail"] == "User lacks required permissions"


async def test_has_exact_permission(
    client: AsyncClient,
    default_user: User,
    default_user_headers: Dict[str, str],
    session: AsyncSession,
):
    role_creator = Role(
        name="Role Creator",
        permissions={Permissions.CAN_CREATE_ROLES},
        inverse_permissions=set(),
        priority=10,
        display_role=False,
    )
    session.add(role_creator)
    default_user = (
        await session.scalars(
            select(User)
            .where(User.id == default_user.id)
            .options(selectinload(User.roles))
        )
    ).one()
    default_user.roles.append(role_creator)
    await session.commit()

    response = await client.post(
        app.url_path_for("create_role"),
        headers=default_user_headers,
        json={
            "name": "Member",
            "permissions": [Permissions.CAN_USE_MACHINES],
            "inverse_permissions": [],
            "display_role": False,
            "priority": 1,
        },
    )
    assert response.status_code == codes.OK
    assert (
        (
            await session.scalar(
                select(Role.name).where(
                    Role.permissions.contains([Permissions.CAN_USE_MACHINES])
                )
            )
        )
    ) == "Member"


async def test_has_exact_permission_but_missing_superuser(
    client: AsyncClient,
    default_user: User,
    default_user_headers: Dict[str, str],
    session: AsyncSession,
):
    role_creator = Role(
        name="Role Creator",
        permissions={Permissions.CAN_CREATE_ROLES},
        inverse_permissions=set(),
        priority=10,
        display_role=False,
    )
    session.add(role_creator)
    default_user = (
        await session.scalars(
            select(User)
            .where(User.id == default_user.id)
            .options(selectinload(User.roles))
        )
    ).one()
    default_user.roles.append(role_creator)
    await session.commit()

    response = await client.post(
        app.url_path_for("create_role"),
        headers=default_user_headers,
        json={
            "name": "Jail",
            "permissions": [Permissions.LOCKOUT],
            "inverse_permissions": [],
            "display_role": False,
            "priority": 1000,
        },
    )
    assert response.status_code == codes.FORBIDDEN
    assert (
        response.json()["detail"]
        == "Only superusers can create roles with IS_SUPERUSER, ROLE_CHANGE_IMMUNE, and LOCKOUT"
    )
