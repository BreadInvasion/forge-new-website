import time
from collections.abc import AsyncGenerator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core import config, security
from core.session import async_session
from models.user import User
from schemas.enums import Permissions
from . import utils

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="login")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


DBSession = Annotated[AsyncSession, Depends(get_session)]


async def get_current_user(
    session: AsyncSession = Depends(get_session),
    token: str = Depends(
        reusable_oauth2
    ),  # The token is pulled all the way from the calling request, thanks to Depends
) -> User:
    try:
        payload = jwt.decode(
            token, config.settings.SECRET_KEY, algorithms=[security.JWT_ALGORITHM]
        )
    except jwt.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials.",
        )
    # JWT guarantees payload will be unchanged (and thus valid), no errors here
    token_data = security.JWTTokenPayload(**payload)

    now = int(time.time())
    if now < token_data.issued_at or now > token_data.expires_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials, token expired or not yet valid",
        )

    result = await session.execute(select(User).where(User.RCSID == token_data.sub))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


class PermittedUserChecker:
    def __init__(self, required_permissions: set[Permissions]):
        self.required_permissions = required_permissions

    async def __call__(
        self,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user),
    ) -> User:
        user_permissions = await utils.get_user_permissions(session, current_user.id)

        if Permissions.IS_SUPERUSER in user_permissions:
            return current_user

        if Permissions.LOCKOUT in user_permissions:
            raise HTTPException(
                status_code=403,
                detail="User access has been disabled by an administrator",
            )

        if not self.required_permissions.issubset(user_permissions):
            raise HTTPException(
                status_code=403, detail="User lacks required permissions"
            )

        return current_user
