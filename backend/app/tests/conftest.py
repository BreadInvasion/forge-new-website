from collections.abc import AsyncGenerator, Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import delete, select
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.core.db import engine, init_db
from app.main import app
from app.models.user import User
from app.tests.utils.user import authentication_token_from_RCSID_RIN
from app.tests.utils.utils import get_superuser_token_headers


@pytest.fixture(scope="session", autouse=True)
async def db() -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        await init_db(session)
        yield session
        await session.execute(
            delete(User)
        )  # Ignore deprecation warning, .exec doesn't support delete for some reason
        await session.commit()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    return get_superuser_token_headers(client)


@pytest.fixture(scope="module")
async def normal_user_token_headers(
    client: TestClient, db: AsyncSession
) -> dict[str, str]:
    return await authentication_token_from_RCSID_RIN(
        client=client, RCSID="obamab", RIN=123456789, db=db
    )
