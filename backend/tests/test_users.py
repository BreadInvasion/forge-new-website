from httpx import AsyncClient, codes
from pydantic import SecretStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..main import app
from models import User
from .conftest import default_user_object, default_user_password
from core import security


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
    new_password = SecretStr("testxxxxxx")
    new_password_hash = security.get_password_hash(new_password)

    response = await client.post(
        app.url_path_for("reset_current_user_password"),
        headers=default_user_headers,
        json={"password": new_password.get_secret_value()},
    )
    assert response.status_code == codes.OK
    user = await session.scalar(
        select(User).where(User.RCSID == default_user_object.RCSID)
    )
    assert user is not None
    assert user.hashed_password != default_user_object.hashed_password

    response = await client.post(
        app.url_path_for("login_access_token"),
        data={
            "username": default_user_object.RCSID,
            "password": new_password.get_secret_value(),
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == codes.OK

    response = await client.post(
        app.url_path_for("login_access_token"),
        data={
            "username": default_user_object.RCSID,
            "password": default_user_password,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == codes.BAD_REQUEST


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
            "major": "Political Science",
            "genderIdentity": 1,  # GenderStatsType.MALE
            "pronouns": "he_him",  # PronounType.HE_HIM
            "password": "BarackObama",
        },
    )
    assert response.status_code == codes.OK
    result = await session.execute(select(User).where(User.RCSID == "obamab"))
    user = result.scalars().first()
    assert user is not None
