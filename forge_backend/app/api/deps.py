import time
from collections.abc import AsyncGenerator
from typing import Any, Dict, List, Set
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core import config, security
from app.core.session import async_session
from app.models import Permission, Role, User

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="login")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


async def get_current_user(
    session: AsyncSession = Depends(get_session), token: str = Depends(reusable_oauth2)
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


async def get_user_permission_tags(
    user_RCSID: str, session: AsyncSession = Depends(get_session)
) -> Set[str]:
    user = (
        await session.scalars(
            select(User)
            .where(User.RCSID == user_RCSID)
            .options(selectinload(User.roles).selectinload(Role.permissions))
            .options(selectinload(User.roles).selectinload(Role.inverse_permissions))
        )
    ).one()
    permission_tag_set: Dict[str, int] = {}
    for role in user.roles:
        for permission in role.permissions:
            if (
                permission.tag not in permission_tag_set
                or permission_tag_set[permission.tag] < role.priority
            ):
                permission_tag_set[permission.tag] = role.priority

        for inverse_permission in role.inverse_permissions:
            if (
                inverse_permission.tag in permission_tag_set
                and permission_tag_set[inverse_permission.tag] < role.priority
            ):
                del permission_tag_set[inverse_permission.tag]

    return set(permission_tag_set.keys())


class PermittedUserChecker:
    def __init__(self, required_permission_tags: Set[str]):
        self.required_permission_tags = required_permission_tags

    async def __call__(
        self,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user),
    ) -> User:
        user_permission_tags = await get_user_permission_tags(current_user.RCSID)

        if not self.required_permission_tags.issubset(user_permission_tags):
            raise HTTPException(
                status_code=403, detail="User lacks required permissions"
            )

        return current_user
