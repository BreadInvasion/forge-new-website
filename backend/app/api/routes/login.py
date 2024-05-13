from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app import crud
from app.api.deps import PermittedUserChecker, SessionDep
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserBase
from app.models.auth import TokenResponse
from app.models.user_requests import EmailPasswordResetRequest
from app.utils import (
    generate_email_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
)

router = APIRouter()


@router.post("/login")
async def login(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> TokenResponse:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await crud.authenticate(
        session=session, RCSID=form_data.username, password=form_data.password
    )
    if not user or user.is_deleted:
        raise HTTPException(status_code=401, detail="Incorrect RCSID or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return TokenResponse(
        access_token=security.create_access_token(
            user.RCSID, expires_delta=access_token_expires
        )
    )


@router.post("/token", response_model=UserBase)
async def test_token(
    current_user: Annotated[User, Depends(PermittedUserChecker(None))]
) -> User:
    """
    Test access token
    """
    return current_user


@router.post("/refresh")
async def refresh_token(
    current_user: Annotated[User, Depends(PermittedUserChecker(None))]
) -> TokenResponse:
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return TokenResponse(
        access_token=security.create_access_token(
            current_user.RCSID, expires_delta=access_token_expires
        )
    )


@router.post("/password-recovery/{RCSID}")
async def recover_password(RCSID: str, session: SessionDep) -> None:
    """
    Password Recovery
    """
    user = await crud.get_user_by_rcsid(session=session, RCSID=RCSID)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_email_token(
        RCSID=RCSID, expire_hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS
    )
    email_data = generate_reset_password_email(user=user, token=password_reset_token)
    send_email(
        email_to=user.RCSID + "@rpi.edu",
        subject=email_data.subject,
        html_content=email_data.html_content,
    )


@router.post("/reset-password")
async def reset_password(session: SessionDep, body: EmailPasswordResetRequest) -> None:
    """
    Reset password
    """
    RCSID = verify_password_reset_token(token=body.access_token)
    if not RCSID:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = await crud.get_user_by_rcsid(session=session, RCSID=RCSID)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this RCSID does not exist in the system.",
        )
    elif user.is_deleted:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(password=body.new_password)
    if user.hashed_password == hashed_password:
        raise HTTPException(
            status_code=400, detail="This is already the password for this account."
        )

    user.hashed_password = hashed_password
    session.add(user)
    await session.commit()
    return
