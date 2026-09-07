"""Email authentication token endpoints."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

from azure.communication.email import EmailClient
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from core.config import settings
from models.auth_token import AuthToken
from models.user import User
from models.role import Role
from schemas.enums import TokenType, Permissions
from schemas.requests import VerificationTokenRequest, ResetPasswordRequest
from schemas.responses import VerificationTokenResponse

from ..deps import DBSession, PermittedUserChecker

MACHINE_USAGE_MINIMUM = [Permissions.CAN_USE_MACHINES, Permissions.CAN_SEE_MACHINES, Permissions.CAN_SEE_RESOURCE_SLOTS, Permissions.CAN_SEE_RESOURCES]

router = APIRouter()

async def send_email(email, token, token_type):
    client = EmailClient.from_connection_string(
        settings.AZURE_COMMUNICATION_CONNECTION_STRING
    )

    url = f"{settings.BACKEND_CORS_ORIGINS[0]}verify-email/{token}" # TODO change to fake url
    
    message = {
        "senderAddress": "DoNotReply@notifications.rpiforge.dev",
        "recipients": {
            "to": [{"address": f"{email}"}]
        },
        "content": {
            "subject": f"Verify Your Forge Account",
            "plainText": f"Please go to {url} to verify your account.\nThis URL will expire in 1 hour.",
        },
    }
    
    poller = client.begin_send(message)
    result = poller.result()
    if (result['status'] != 'Succeeded' or result['error'] is not None):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to send email verification email."
        )

    return VerificationTokenResponse(token_type=token_type, success=True)


@router.post("/email-verification/{token}")
async def verify_email_token(
    token: str, 
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
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

    if (not auth_token or auth_token.user_id != current_user.id):
        return VerificationTokenResponse(token_type=TokenType.EMAIL_VERIFICATION, success=False)

    now = datetime.now(timezone.utc)

    if not auth_token or auth_token.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )

    current_user.is_email_verified = True

    # along with verification we also let them use machines
    role = await session.scalar(select(Role).where(Role.permissions == MACHINE_USAGE_MINIMUM))
    if (role):
        current_user.roles.append(role)
        session.add(current_user)

    # TODO add something that regularly deletes old used tokens
    auth_token.used_at = now
    await session.commit()

    return VerificationTokenResponse(token_type=TokenType.EMAIL_VERIFICATION, success=True)


@router.get("/email-verification/{token}")
async def get_email_verification(
    token: str,
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
):
    """Check whether an email verification token is valid."""

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()

    auth_token = await session.scalar(
        select(AuthToken).where(
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == TokenType.EMAIL_VERIFICATION,
            AuthToken.used_at.is_(None),
        )
    )

    if (not auth_token or auth_token.user_id != current_user.id):
        return VerificationTokenResponse(token_type=TokenType.EMAIL_VERIFICATION, success=False)

    now = datetime.now(timezone.utc)

    if not auth_token or auth_token.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )

    return VerificationTokenResponse(token_type=TokenType.EMAIL_VERIFICATION, success=True)


@router.post("/verification")
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

    return VerificationTokenResponse(token_type=request.tokenType, success=True)