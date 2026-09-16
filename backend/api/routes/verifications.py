"""Email authentication token endpoints."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

from azure.communication.email import EmailClient
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func

from core.config import settings
from models.auth_token import AuthToken
from models.user import User
from models.role import Role
from core.security import get_password_hash
from schemas.enums import TokenType, Permissions
from schemas.requests import VerificationTokenRequest, ResetPasswordRequest, ResetPasswordTokenRequest
from schemas.responses import VerificationTokenResponse

from ..deps import DBSession, PermittedUserChecker


MACHINE_USAGE_MINIMUM = [Permissions.CAN_USE_MACHINES, Permissions.CAN_SEE_MACHINES, Permissions.CAN_SEE_RESOURCE_SLOTS, Permissions.CAN_SEE_RESOURCES, Permissions.CAN_SEE_SEMESTERS]

router = APIRouter()


async def create_token(
    session: DBSession,
    tokenType: TokenType,
    current_user: User
):

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()

    minutes = 15 if tokenType == TokenType.PASSWORD_RESET else 60
    auth_token = AuthToken(
        user_id=current_user.id,
        token_hash=token_hash,
        token_type=tokenType,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=minutes),
    )

    session.add(auth_token)
    await session.commit()

    print("token: ", token)

    await send_email(f"{current_user.RCSID}@rpi.edu", token, tokenType)

    return VerificationTokenResponse(token_type=tokenType, success=True)


async def send_email(email, token, token_type):
    client = EmailClient.from_connection_string(
        settings.AZURE_COMMUNICATION_CONNECTION_STRING
    )

    if (token_type == TokenType.EMAIL_VERIFICATION):
        url = f"{settings.BACKEND_CORS_ORIGINS[0]}verify-email/{token}"
        
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
    
    if (token_type == TokenType.PASSWORD_RESET):
        url = f"{settings.BACKEND_CORS_ORIGINS[0]}reset/{token}"
        
        message = {
            "senderAddress": "DoNotReply@notifications.rpiforge.dev",
            "recipients": {
            "to": [{"address": f"{email}"}]
            },
            "content": {
                "subject": f"Reset your Forge Account Password",
                "plainText": f"Please go to {url} to reset your password.\nThis URL will expire in 15 minutes.",
            },
        }
        
        poller = client.begin_send(message)
        result = poller.result()
        if (result['status'] != 'Succeeded' or result['error'] is not None):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to send password reset email."
            )
        return VerificationTokenResponse(token_type=token_type, success=True)


async def check_token(
    session: DBSession, 
    tokenType: TokenType,
    token: str, 
    current_user: User,
    return_token: bool = False
):
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()

    auth_token = await session.scalar(
        select(AuthToken).where(
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == tokenType,
            AuthToken.used_at.is_(None),
        )
    )

    if (not auth_token or (tokenType == TokenType.EMAIL_VERIFICATION and auth_token.user_id != current_user.id)):
        if (return_token):
            return VerificationTokenResponse(token_type=tokenType, success=False), None
        return VerificationTokenResponse(token_type=tokenType, success=False)

    now = datetime.now(timezone.utc)

    if not auth_token or auth_token.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )

    if (return_token):
        return VerificationTokenResponse(token_type=tokenType, success=True), auth_token
    return VerificationTokenResponse(token_type=tokenType, success=True)


@router.post("/email-verification/{token}")
async def verify_email_token(
    token: str, 
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
):
    """Verify an account with an email verification token."""

    response, auth_token = await check_token(session, TokenType.EMAIL_VERIFICATION, token, current_user, True)
    if (not response.success):
        return response

    current_user.is_email_verified = True

    # along with verification we also let them use machines
    role = await session.scalar(
        select(Role).where(
            Role.permissions.op("@>")(MACHINE_USAGE_MINIMUM),
            func.cardinality(Role.permissions) == len(MACHINE_USAGE_MINIMUM),
        )
    )

    if (role):
        current_user.roles.append(role)
        session.add(current_user)

    # TODO add something that regularly deletes old used tokens
    auth_token.used_at = datetime.now(timezone.utc)
    await session.commit()

    return VerificationTokenResponse(token_type=TokenType.EMAIL_VERIFICATION, success=True)


@router.post("/password-verification/{token}")
async def reset_password(
    token: str,
    session: DBSession,
    request: ResetPasswordRequest,
):
    """Reset a user's password with a valid password reset token."""

    response, auth_token = await check_token(session, TokenType.PASSWORD_RESET, token, None, True)
    if not response.success:
        return response

    user = await session.get(User, auth_token.user_id)
    if user is None or user.RCSID != request.rcsid:
        return VerificationTokenResponse(token_type=TokenType.PASSWORD_RESET, success=False)

    user.hashed_password = get_password_hash(request.new_password)
    auth_token.used_at = datetime.now(timezone.utc)
    await session.commit()

    return VerificationTokenResponse(token_type=TokenType.PASSWORD_RESET, success=True)


@router.get("/email-verification/{token}")
async def get_email_verification(
    token: str,
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
):
    """Check whether an email verification token is valid."""

    return await check_token(session, TokenType.EMAIL_VERIFICATION, token, current_user)


@router.get("/password-verification/{token}")
async def get_password_verification(
    token: str,
    session: DBSession,
):
    """Check whether a reset password token is valid."""

    return await check_token(session, TokenType.PASSWORD_RESET, token, None)


@router.post("/email-verification")
async def create_email_token(
    session: DBSession,
    request: VerificationTokenRequest,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
):
    """Create and send an email verification token to the user's RPI email."""

    if (request.token_type != TokenType.EMAIL_VERIFICATION):
       return VerificationTokenResponse(token_type=request.token_type, success=False)
    
    return await create_token(session, request.token_type, current_user)


@router.post("/password-verification")
async def create_password_token(
    session: DBSession,
    request: ResetPasswordTokenRequest,
):
    """Create and send a password reset token to the user's RPI email."""

    current_user = await session.scalar(
        select(User).where(
            User.RCSID == request.rcsid
        )
    )

    if (not current_user or request.token_type != TokenType.PASSWORD_RESET):
       return VerificationTokenResponse(token_type=request.token_type, success=False)
        
    return await create_token(session, request.token_type, current_user)