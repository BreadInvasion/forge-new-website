"""Email authentication token endpoints."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from models.auth_token import AuthToken
from models.user import User
from schemas.enums import TokenType
from schemas.requests import VerificationTokenRequest, ResetPasswordRequest

from ..deps import DBSession, PermittedUserChecker


router = APIRouter()

async def send_email(email: str, token: str, token_type: TokenType) -> None:
    """Placeholder for the email service integration."""


@router.post("/auth/email-verification/{token}")
async def verify_email_token(
    token: str, 
    session: DBSession
):
    """Verify an account with an email verification token."""

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    auth_token = await session.scalar(
        select(AuthToken).where(
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == TokenType.EMAIL_VERIFICATION,
            AuthToken.used_at.is_(None),
        )
    )

    now = datetime.now(timezone.utc)

    if not auth_token or auth_token.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )

    # TODO actually set verified to true
    # TODO add something that regularly deletes old used tokens
    auth_token.used_at = now
    await session.commit()

    return {"message": "Email verified successfully."}


@router.post("/auth/verification")
async def create_verification_token(
    session: DBSession,
    request: VerificationTokenRequest,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
):
    """Create and send an authentication token to the user's RPI email."""

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    auth_token = AuthToken(
        user_id=current_user.id,
        token_hash=token_hash,
        token_type=request.tokenType,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    session.add(auth_token)
    await session.commit()

    await send_email(f"{current_user.RCSID}@rpi.edu", token, request.tokenType)

    return {"message": "Verification email sent."}