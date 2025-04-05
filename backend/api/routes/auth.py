""" User authentication endpoints. """

from decimal import Decimal
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import and_, func, select

from models.machine_usage import MachineUsage
from models.state import State
from models.user import User
from schemas.enums import Permissions
from schemas.responses import AccessTokenResponse, UserNoHash

from ..deps import DBSession, PermittedUserChecker
from ..utils import get_user_permissions

from core.security import create_token_response, verify_password


router = APIRouter()

AUTH_FAILED_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect username or password",
    headers={"WWW-Authenticate": "Bearer"},
)

ACCOUNT_DISABLED_ERROR = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="User access has been disabled by an administrator",
    headers={"WWW-Authenticate": "Bearer"},
)


@router.post("/login")
async def login_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: DBSession
) -> AccessTokenResponse:
    """Check if user credentials are valid. If they are, create and return an access token."""

    user = await session.scalar(select(User).where(User.RCSID == form_data.username))
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise AUTH_FAILED_ERROR

    user_permissions = await get_user_permissions(session, user.id)
    if (
        Permissions.IS_SUPERUSER not in user_permissions
        and Permissions.LOCKOUT in user_permissions
    ):
        # Provided user is locked out. Their credentials are right, but refuse login anyway.
        raise ACCOUNT_DISABLED_ERROR

    return create_token_response(user.RCSID)


@router.get("/refresh")
async def refresh_auth(
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))]
):
    """If the user has a valid access token, create and return a fresh one."""

    # Auth and permissions check is handled by the dependency injection, so we can just return a fresh token.
    return create_token_response(current_user.RCSID)


@router.get("/me")
async def get_current_user(
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker(set()))],
):
    """If the user has a valid access token, return current user data"""

    current_semester_id = await session.scalar(select(State.active_semester_id))

    semester_balance = (
        (
            await session.scalar(
                select(func.sum(MachineUsage.cost))
                .select_from(MachineUsage)
                .where(
                    and_(
                        MachineUsage.user_id == current_user.id,
                        MachineUsage.semester_id == current_semester_id,
                    )
                )
            )
        )
        or 0.0
        if current_semester_id
        else 0.0
    )

    return UserNoHash(
        id=current_user.id,
        is_rpi_staff=current_user.is_rpi_staff,
        RCSID=current_user.RCSID,
        RIN=current_user.RIN,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        major=current_user.major,
        gender_identity=current_user.gender_identity,
        pronouns=current_user.pronouns,
        permissions=list({
            permission 
            for role in current_user.roles 
            for permission in role.permissions
        }),
        is_graduating=current_user.is_graduating,
        semester_balance=Decimal(semester_balance),
    )
