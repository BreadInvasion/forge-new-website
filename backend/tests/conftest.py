import asyncio
from collections.abc import AsyncGenerator
from copy import copy
from pydantic import SecretStr

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core import config, security
from core.session import async_engine, async_session
from main import app
from models import Base, Role, User
from schemas.enums import GenderStatsType, Permissions, PronounType

default_user_password = "welcometothefroge"
default_user_object = User(
    RCSID="haddlm",
    RIN="999999999",
    first_name="Mark",
    last_name="Haddleton",
    major="Computer Science",
    gender_identity=GenderStatsType.MALE,
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
        user = await session.scalar(
            select(User).where(User.RCSID == default_user_object.RCSID)
        )
        if user is None:
            user = User(
                RCSID=default_user_object.RCSID,
                RIN=default_user_object.RIN,
                first_name=default_user_object.first_name,
                last_name=default_user_object.last_name,
                major=default_user_object.major,
                gender_identity=default_user_object.gender_identity,
                pronouns=default_user_object.pronouns,
                hashed_password=default_user_object.hashed_password,
                is_graduating=False,
                is_rpi_staff=False,
                active=False,
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
        return user


@pytest_asyncio.fixture
async def default_superuser(default_user: User, session: AsyncSession) -> User:
    user = (
        await session.scalars(
            select(User)
            .where(User.id == default_user.id)
            .options(selectinload(User.roles))
        )
    ).one()
    role = Role(
        name="god",
        permissions={Permissions.IS_SUPERUSER},
        inverse_permissions=set(),
        display_role=False,
        priority=100,
    )
    session.add(role)
    user.roles = [role]
    await session.commit()
    return default_user


@pytest_asyncio.fixture
async def default_user_with_use_machine(default_user) -> User:
    async with async_session() as session:
        role = Role(name="test", permissions={Permissions.CAN_USE_MACHINES})
        session.add(role)
        session.add(default_user)
        default_user.roles = [role]
        await session.commit()
        return default_user


@pytest_asyncio.fixture
async def default_user_with_clear_machine(default_user) -> User:
    async with async_session() as session:
        role = Role(name="test", permissions={Permissions.CAN_CLEAR_MACHINES})
        session.add(role)
        session.add(default_user)
        default_user.roles = [role]
        await session.commit()
        return default_user


@pytest.fixture
def default_user_headers(default_user: User):
    return {"Authorization": f"Bearer {default_user_access_token}"}
