from typing import Dict
from httpx import AsyncClient, codes
from sqlalchemy import any_, select

from app.main import app
from app.models import Role, User
from app.tests.conftest import default_user_headers
from app.schemas.enums import Permissions

from sqlalchemy.ext.asyncio import AsyncSession


async def test_basic(
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
