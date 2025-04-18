from decimal import Decimal
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import ScalarSelect, and_, func, or_, select
from sqlalchemy.orm import selectinload, InstrumentedAttribute

from models.state import State

from ..deps import DBSession, PermittedUserChecker
from ..utils import get_user_permissions

from models.machine_usage import MachineUsage
from models.role import Role
from models.user import User
from schemas.enums import Permissions
from schemas.requests import UserCreateRequest
from schemas.responses import BasicUserResponse, UserNoHash

from core.security import get_password_hash

router = APIRouter()


@router.post("/signup")
async def register_user(
    request: UserCreateRequest, session: DBSession
) -> BasicUserResponse:
    """Register a new Forge user."""

    conflicting_users = await session.scalar(
        select(User).where(or_(User.RCSID == request.RCSID, User.RIN == request.RIN))
    )
    if conflicting_users is not None:
        raise HTTPException(
            status_code=409, detail="A user with that RCSID or RIN already exists"
        )

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
        hashed_password=get_password_hash(request.password),
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return BasicUserResponse.model_validate(
        new_user, strict=False, from_attributes=True
    )


@router.get("/users/rcsid/{rcsid}", tags=["users"])
async def get_user_by_rcsid(
    rcsid: str,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_USERS}))
    ],
) -> UserNoHash:
    """Get a user's info by their RCSID."""

    user = await session.scalar(
        select(User).where(User.RCSID == rcsid).options(selectinload(User.roles))
    )
    if user is None:
        raise HTTPException(
            status_code=404, detail="User with provided RCSID not found"
        )

    current_semester_id = await session.scalar(select(State.active_semester_id))

    user_permissions = await get_user_permissions(session, user.id)

    semester_balance = (
        (
            await session.scalar(
                select(func.sum(MachineUsage.cost))
                .select_from(MachineUsage)
                .where(
                    and_(
                        MachineUsage.user_id == user.id,
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
        id=user.id,
        is_rpi_staff=user.is_rpi_staff,
        RCSID=user.RCSID,
        RIN=user.RIN,
        first_name=user.first_name,
        last_name=user.last_name,
        major=user.major,
        gender_identity=user.gender_identity,
        pronouns=user.pronouns,
        permissions=user_permissions,
        display_role=next((
                role.name 
                for role in user.roles 
                if role.display_role
            ), 
            ""
        ),
        is_graduating=user.is_graduating,
        semester_balance=Decimal(semester_balance),
    )


@router.get("/users/rin/{rin}", tags=["users"])
async def get_user_by_rin(
    rin: str,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_USERS}))
    ],
) -> UserNoHash:
    """Get a user's info by their RIN."""

    user = await session.scalar(
        select(User).where(User.RIN == rin).options(selectinload(User.roles))
    )
    if user is None:
        raise HTTPException(status_code=404, detail="User with provided RIN not found")

    current_semester_id = await session.scalar(select(State.active_semester_id))

    user_permissions = await get_user_permissions(session, user.id)

    semester_balance = (
        (
            await session.scalar(
                select(func.sum(MachineUsage.cost))
                .select_from(MachineUsage)
                .where(
                    and_(
                        MachineUsage.user_id == user.id,
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
        id=user.id,
        is_rpi_staff=user.is_rpi_staff,
        RCSID=user.RCSID,
        RIN=user.RIN,
        first_name=user.first_name,
        last_name=user.last_name,
        major=user.major,
        gender_identity=user.gender_identity,
        pronouns=user.pronouns,
        permissions=user_permissions,
        display_role=next((
                role.name 
                for role in user.roles 
                if role.display_role
            ), 
            ""
        ),
        is_graduating=user.is_graduating,
        semester_balance=Decimal(semester_balance),
    )


@router.get("/users", tags=["users"])
async def get_all_users(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_USERS}))
    ],
    limit: int = 20,
    offset: int = 0,
    order_by: Literal[
        "RCSID",
        "RIN",
        "first_name",
        "last_name",
        "is_rpi_staff",
        "semester_balance",
        "is_graduating",
        "gender_identity",
        "pronouns",
        "major",
    ] = "RCSID",
    descending: bool = False,
):
    """Returns a list of all users. Provide query parameters to cap and re-order the output."""

    current_semester_id = await session.scalar(select(State.active_semester_id))

    attr_key_map: dict[str, InstrumentedAttribute | ScalarSelect] = {
        "RCSID": User.RCSID,
        "RIN": User.RIN,
        "first_name": User.first_name,
        "last_name": User.last_name,
        "is_rpi_staff": User.is_rpi_staff,
        "semester_balance": select(func.sum(MachineUsage.cost))
        .where(
            and_(
                MachineUsage.user_id == User.id,
                MachineUsage.semester_id == current_semester_id,
            )
        )
        .as_scalar(),
        "is_graduating": User.is_graduating,
        "gender_identity": User.gender_identity,
        "pronouns": User.pronouns,
        "major": User.major,
    }
    order_determinant = attr_key_map[order_by]
    if descending:
        order_determinant = order_determinant.desc()

    users = (
        await session.scalars(
            select(User)
            .options(selectinload(User.roles))
            .order_by(order_determinant)
            .limit(limit)
            .offset(offset)
        )
    ).all()

    semester_balances = (
        (
            await session.execute(
                select(User.id, func.sum(MachineUsage.cost))
                .join(MachineUsage.user)
                .where(MachineUsage.semester_id == current_semester_id)
                .group_by(User.id)
            )
        ).all()
        if current_semester_id
        else None
    )

    user_permissions = {
        user.id: await get_user_permissions(session, user.id) 
        for user in users
    }

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
            permissions=user_permissions[user.id],
            display_role=next((
                    role.name 
                    for role in user.roles 
                    if role.display_role
                ), 
                ""
            ),
            is_graduating=user.is_graduating,
            semester_balance=Decimal(
                next(
                    balance.tuple()[1]
                    for balance in semester_balances
                    if balance.tuple()[0] == user.id
                )
                if semester_balances and len(semester_balances) > 0
                else 0.0
            ),
        )
        for user in users
    ]


# GET ALL USERS

# EDIT USER PREFERENCES

# EDIT USER SECURE DETAILS

# HARD DELETE USER
