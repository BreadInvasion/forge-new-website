from typing import AsyncIterator
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from app import crud
from app.core.config import settings
from app.models.user import User
from app.models.user_requests import CreateUserRequest

engine = create_async_engine(
    str(settings.SQLALCHEMY_DATABASE_URI), echo=True, future=True
)


async def get_async_session() -> AsyncIterator[AsyncSession]:
    """Creates an async session for the db engine. If using Depends(get_async_session),
    the session will close automatically when exiting scope."""

    async_session = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-template/issues/28


async def init_db(session: AsyncSession) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    # TODO: Add initial superuser role creation, once roles are re-implemented

    user = (
        await session.exec(
            select(User).where(User.RCSID == settings.FIRST_SUPERUSER_RCSID)
        )
    ).first()
    if not user:
        user_in = CreateUserRequest(
            RCSID=settings.FIRST_SUPERUSER_RCSID,
            RIN=settings.FIRST_SUPERUSER_RIN,
            first_name="super",
            last_name="user",
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_rpi_staff=False,
            major=None,
        )
        user = crud.create_user(session=session, user_create=user_in)
