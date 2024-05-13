from fastapi.testclient import TestClient
from sqlmodel.ext.asyncio.session import AsyncSession

from app import crud
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User
from app.models.user_requests import CreateUserRequest


def user_authentication_headers(
    *, client: TestClient, RCSID: str, password: str
) -> dict[str, str]:
    data = {"username": RCSID, "password": password}

    r = client.post(f"{settings.API_V1_STR}/login", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


async def authentication_token_from_RCSID_RIN(
    *, client: TestClient, RCSID: str, RIN: int, db: AsyncSession
) -> dict[str, str]:
    """
    Return a valid token for the user with given RCSID and RIN.

    If the user doesn't exist it is created first.
    """
    password = f"TEST PASSWORD {RCSID}"
    user = await crud.get_user_by_rcsid(session=db, RCSID=RCSID)
    if not user:
        user_in_create = CreateUserRequest(
            RCSID=RCSID,
            RIN=RIN,
            is_rpi_staff=False,
            first_name="Test",
            last_name="User",
            password=password,
            major=None,
        )
        user = crud.create_user(session=db, user_create=user_in_create)
    else:
        user.hashed_password = get_password_hash(password)
        db.add(user)
        await db.commit()

    return user_authentication_headers(client=client, RCSID=RCSID, password=password)
