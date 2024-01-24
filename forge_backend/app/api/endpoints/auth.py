import time

import jwt
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core import config, security
from app.models import User
from app.schemas.enums import PERMISSIONS_NONE, Permissions
from app.api import utils

router = APIRouter()


@router.post("/login")
async def login_access_token(
    session: AsyncSession = Depends(deps.get_session),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """OAuth2 compatible token, get an access token for future requests using username and password"""

    result = await session.execute(select(User).where(User.RCSID == form_data.username))
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if await utils.has_permission(session, user.id, Permissions.LOCKOUT):
        raise HTTPException(
            status_code=403, detail="User access has been disabled by an administrator"
        )

    return security.create_token_response(user.RCSID)


@router.post("/refresh")
async def refresh_token(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.PermittedUserChecker(PERMISSIONS_NONE)),
):
    """OAuth2 compatible token, get a new access token for the currently active user"""

    return security.create_token_response(current_user.RCSID)
