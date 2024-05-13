from typing import Any

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserPrivate
from app.models.user_requests import CreateUserRequest


async def create_user(*, session: AsyncSession, user_create: CreateUserRequest) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def update_user(
    *, session: AsyncSession, db_user: User, user_in: UserPrivate
) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    db_user.sqlmodel_update(user_data)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user


async def get_user_by_rcsid(*, session: AsyncSession, RCSID: str) -> User | None:
    statement = select(User).where(User.RCSID == RCSID)
    user = (await session.exec(statement)).first()
    return user


async def get_user_by_rin(*, session: AsyncSession, RIN: int) -> User | None:
    statement = select(User).where(User.RIN == RIN)
    user = (await session.exec(statement)).first()
    return user


async def authenticate(
    *, session: AsyncSession, RCSID: str, password: str
) -> User | None:
    db_user = await get_user_by_rcsid(session=session, RCSID=RCSID)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user
