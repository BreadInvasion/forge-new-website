from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlmodel import Session

from app import crud
from app.core.config import settings


def test_get_users_superuser_me(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    r = client.get(f"{settings.API_V1_STR}/me", headers=superuser_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["RCSID"] == settings.FIRST_SUPERUSER_RCSID


def test_get_users_normal_user_me(
    client: TestClient, normal_user_token_headers: dict[str, str]
) -> None:
    r = client.get(f"{settings.API_V1_STR}/users/me", headers=normal_user_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["is_active"] is True
    assert current_user["RCSID"] == "obamab"
