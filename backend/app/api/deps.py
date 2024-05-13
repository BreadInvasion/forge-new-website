from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload

from app.core import security
from app.core.config import settings
from app.core.db import get_async_session
from app.crud import get_user_by_rcsid
from app.enums import Permission
from app.models.auth import TokenPayload
from app.models.user import User

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login")

SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


def get_user_permissions(user: User) -> set[Permission]:
    permission_dict: dict[Permission, int] = {}

    # Add all positive permissions at their strongest priority
    for role in user.roles:
        for permission in role.permissions:
            if (
                permission not in permission_dict
                or permission_dict[permission] < role.priority
            ):
                permission_dict[permission] = role.priority

    # Apply any eligible inverse permissions
    for role in user.roles:
        for permission in role.inverse_permissions:
            if (
                permission in permission_dict
                and permission_dict[permission] <= role.priority
            ):
                del permission_dict[permission]

    return set(permission_dict.keys())


async def get_current_user(
    session: SessionDep,
    token: Annotated[str, Depends(reusable_oauth2)],
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = await get_user_by_rcsid(session=session, RCSID=token_data.RCSID)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_deleted:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


class PermittedUserChecker:
    def __init__(self, required_permissions: set[Permission] | None):
        self.required_permissions = required_permissions

    async def __call__(
        self,
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if not current_user.is_validated:
            raise HTTPException(
                status_code=403,
                detail="User requires email validation",
            )

        user_permissions = get_user_permissions(current_user)

        if Permission.ADMINISTRATOR in user_permissions:
            return current_user

        if Permission.LOCKOUT in user_permissions:
            raise HTTPException(
                status_code=403,
                detail="User access has been disabled by an administrator",
            )

        if self.required_permissions and not self.required_permissions.issubset(
            user_permissions
        ):
            raise HTTPException(
                status_code=403, detail="User lacks required permissions"
            )

        return current_user
