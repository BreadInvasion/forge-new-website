import asyncio
from collections.abc import AsyncGenerator
from pydantic import SecretStr

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import config, security
from app.core.session import async_engine, async_session
from app.main import app
from app.models import Base, User, PronounType
from app.schemas.enums import GenderType

default_user_password = "welcometothefroge"
default_user_object = User(
    RCSID="haddlm",
    RIN="999999999",
    first_name="Mark",
    last_name="Haddleton",
    major="Computer Science",
    gender_identity=GenderType.MALE,
    pronouns=PronounType.HE_HIM,
    hashed_password=security.get_password_hash(SecretStr(default_user_password)),
)
default_user_access_token = security.create_jwt_token(
    str(default_user_object.RCSID), 60 * 60 * 24
)[0]


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def test_db_setup_sessionmaker():
    # assert if we use TEST_DB URL for 100%
    assert config.settings.ENVIRONMENT == "PYTEST"

    # always drop and create test db tables between tests session
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@pytest_asyncio.fixture(autouse=True)
async def session(test_db_setup_sessionmaker) -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

        # delete all data from all tables after test
        for name, table in Base.metadata.tables.items():
            await session.execute(delete(table))
        await session.commit()


@pytest_asyncio.fixture(scope="session")
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(app=app, base_url="http://test") as client:
        client.headers.update({"Host": "localhost"})
        yield client


@pytest_asyncio.fixture
async def default_user(test_db_setup_sessionmaker) -> User:
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.RCSID == default_user_object.RCSID)
        )
        user = result.scalars().first()
        if user is None:
            session.add(default_user_object)
            await session.commit()
            await session.refresh(default_user_object)
            return default_user_object
        return user


@pytest.fixture
def default_user_headers(default_user: User):
    return {"Authorization": f"Bearer {default_user_access_token}"}
