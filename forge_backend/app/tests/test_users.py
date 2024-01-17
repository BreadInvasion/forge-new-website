from httpx import AsyncClient, codes
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.models import User
from app.tests.conftest import default_user_object
from app.schemas.enums import GenderType


async def test_read_current_user(client: AsyncClient, default_user_headers):
    response = await client.get(
        app.url_path_for("read_current_user"), headers=default_user_headers
    )
    assert response.status_code == codes.OK
    assert response.json() == {
        "RCSID": default_user_object.RCSID,
        "firstName": default_user_object.first_name,
        "lastName": default_user_object.last_name,
    }


async def test_reset_current_user_password(
    client: AsyncClient, default_user_headers, session: AsyncSession
):
    response = await client.post(
        app.url_path_for("reset_current_user_password"),
        headers=default_user_headers,
        json={"password": "testxxxxxx"},
    )
    assert response.status_code == codes.OK
    result = await session.execute(
        select(User).where(User.RCSID == default_user_object.RCSID)
    )
    user = result.scalars().first()
    assert user is not None
    assert user.hashed_password != default_user_object.hashed_password


async def test_register_new_user(
    client: AsyncClient, default_user_headers, session: AsyncSession
):
    response = await client.post(
        app.url_path_for("register_new_user"),
        headers=default_user_headers,
        json={
            "RCSID": "obamab",
            "RIN": "123456789",
            "firstName": "Barack",
            "lastName": "Obama",
            "genderIdentity": 1,  # GenderType.MALE
            "pronouns": "he_him",  # PronounType.HE_HIM
            "password": "BarackObama",
        },
    )
    assert response.status_code == codes.OK
    result = await session.execute(select(User).where(User.RCSID == "obamab"))
    user = result.scalars().first()
    assert user is not None
