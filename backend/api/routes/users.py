from typing import Annotated, Callable, Literal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import selectinload, InstrumentedAttribute
from ..deps import DBSession, PermittedUserChecker

from sqlalchemy.ext.asyncio import AsyncSession

from models.role import Role
from models.user import User
from schemas.enums import Permissions
from schemas.requests import UserCreateRequest
from schemas.responses import BasicUserResponse, UserNoHash

from core.security import get_password_hash

router = APIRouter()

@router.post("/signup")
async def register_user(request: UserCreateRequest, session: DBSession) -> BasicUserResponse:
    """Register a new Forge user."""

    conflicting_users = await session.scalar(select(User).where(or_(User.RCSID == request.RCSID, User.RIN == request.RIN)))
    if conflicting_users is not None:
        raise HTTPException(status_code=409, detail="A user with that RCSID or RIN already exists")
    
    new_user = User(
        RCSID=request.RCSID,
        RIN=request.RIN,
        first_name=request.first_name,
        last_name=request.last_name,
        major=request.major,
        gender_identity=request.gender_identity,
        pronouns=request.pronouns,
        is_rpi_staff=False,
        is_graduating=False,
        hashed_password=get_password_hash(request.password)
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return BasicUserResponse.model_validate(new_user, strict=False, from_attributes=True)

@router.get("/users/rcsid/{rcsid}")
async def get_user_by_rcsid(
    rcsid: str,
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker({Permissions.CAN_SEE_USERS}))]
    ) -> UserNoHash:
    """Get a user's info by their RCSID."""

    user = await session.scalar(select(User).where(User.RCSID == rcsid).options(selectinload(User.roles)))
    if user is None:
        raise HTTPException(status_code=404, detail="User with provided RCSID not found")

    return UserNoHash(
        id=user.id,
        is_rpi_staff=user.is_rpi_staff,
        RCSID=user.RCSID,
        RIN=user.RIN,
        first_name=user.first_name,
        last_name=user.last_name,
        major=user.major,
        gender_identity=user.gender_identity,
        pronouns=user.pronouns,
        role_ids=[role.id for role in user.roles],
        is_graduating=user.is_graduating,
    )

@router.get("/users/rin/{rin}")
async def get_user_by_rin(
    rin: str,
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker({Permissions.CAN_SEE_USERS}))]
    ) -> UserNoHash:
    """Get a user's info by their RIN."""

    user = await session.scalar(select(User).where(User.RIN == rin).options(selectinload(User.roles)))
    if user is None:
        raise HTTPException(status_code=404, detail="User with provided RIN not found")

    return UserNoHash(
        id=user.id,
        is_rpi_staff=user.is_rpi_staff,
        RCSID=user.RCSID,
        RIN=user.RIN,
        first_name=user.first_name,
        last_name=user.last_name,
        major=user.major,
        gender_identity=user.gender_identity,
        pronouns=user.pronouns,
        role_ids=[role.id for role in user.roles],
        is_graduating=user.is_graduating,
    )

@router.get("/users")
async def get_all_users(
    session: DBSession,
    current_user: Annotated[User, Depends(PermittedUserChecker({Permissions.CAN_SEE_USERS}))],
    limit: int = 20,
    offset: int = 0,
    order_by: Literal["RCSID", "RIN", "first_name", "last_name", "is_rpi_staff"] = "RCSID",
    descending: bool = False
    ):
    """Returns a list of all users. Provide query parameters to cap and re-order the output."""

    attr_key_map: dict[str, InstrumentedAttribute] = {
        "RCSID": User.RCSID,
        "RIN": User.RIN,
        "first_name": User.first_name,
        "last_name": User.last_name,
        "is_rpi_staff": User.is_rpi_staff
    }
    order_determinant = attr_key_map[order_by]
    if descending:
        order_determinant = order_determinant.desc()

    users = (await session.scalars(select(User).order_by(order_determinant).limit(limit).offset(offset))).all()

    return [
        UserNoHash(
            id=user.id,
            is_rpi_staff=user.is_rpi_staff,
            RCSID=user.RCSID,
            RIN=user.RIN,
            first_name=user.first_name,
            last_name=user.last_name,
            major=user.major,
            gender_identity=user.gender_identity,
            pronouns=user.pronouns,
            role_ids=[role.id for role in user.roles],
            is_graduating=user.is_graduating,
        ) for user in users
    ]

# GET ALL USERS

# EDIT USER PREFERENCES

# EDIT USER SECURE DETAILS

# HARD DELETE USER

