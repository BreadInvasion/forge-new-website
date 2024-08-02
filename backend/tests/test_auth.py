from httpx import AsyncClient, codes

from main import app
from models import User
from tests.conftest import default_user_object, default_user_password

from freezegun import freeze_time
from datetime import timedelta


async def test_auth_access_token(client: AsyncClient, default_user: User):
    response = await client.post(
        app.url_path_for("login_access_token"),
        data={
            "username": default_user_object.RCSID,
            "password": default_user_password,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == codes.OK
    token = response.json()
    assert token["token_type"] == "bearer"
    assert "access_token" in token
    assert "expires_at" in token
    assert "issued_at" in token


async def test_auth_access_token_expires(client: AsyncClient, default_user: User):
    with freeze_time() as frozen_time:
        response = await client.post(
            app.url_path_for("login_access_token"),
            data={
                "username": default_user_object.RCSID,
                "password": default_user_password,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert response.status_code == codes.OK
        token = response.json()["access_token"]

        frozen_time.tick(delta=timedelta(minutes=20))

        response = await client.get(
            app.url_path_for("read_current_user"),
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == codes.FORBIDDEN
        assert response.json() == {
            "detail": "Could not validate credentials, token expired or not yet valid"
        }


async def test_auth_access_token_fail_no_user(client: AsyncClient):
    response = await client.post(
        app.url_path_for("login_access_token"),
        data={
            "username": "xxx",
            "password": "yyy",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == codes.BAD_REQUEST
    assert response.json() == {"detail": "Incorrect email or password"}


async def test_auth_access_token_fail_wrong_password(
    client: AsyncClient, default_user: User
):
    response = await client.post(
        app.url_path_for("login_access_token"),
        data={
            "username": default_user_object.RCSID,
            "password": "yyy",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == codes.BAD_REQUEST
    assert response.json() == {"detail": "Incorrect email or password"}
