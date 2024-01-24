from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import Role, User
from app.schemas.requests import (
    UserAddRoleRequest,
    UserChangeDetailsRequest,
    UserChangeNameRequest,
    UserChangePronounsRequest,
    UserCreateRequest,
    UserChangeRCSIDRequest,
    UserChangeRINRequest,
    UserDeleteRequest,
    UserUpdatePasswordRequest,
)
from app.schemas.responses import UserResponse
from app.schemas.enums import PERMISSIONS_NONE, RESTRICTED_PERMISSIONS, Permissions
from app.api import utils

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(deps.PermittedUserChecker(PERMISSIONS_NONE)),
):
    """Get current user"""
    return UserResponse(
        RCSID=current_user.RCSID,
        firstName=current_user.first_name,
        lastName=current_user.last_name,
    )


@router.post("/me/change-password")
async def reset_current_user_password(
    user_update_password: UserUpdatePasswordRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.PermittedUserChecker(PERMISSIONS_NONE)),
):
    """Update current user password"""
    current_user.hashed_password = get_password_hash(user_update_password.password)
    session.add(current_user)
    await session.commit()
    return


@router.post("/me/change-name")
async def change_current_user_name(
    user_change_name: UserChangeNameRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.PermittedUserChecker(PERMISSIONS_NONE)),
):
    """Update current user's first and last name"""
    if user_change_name.firstName == "" or user_change_name.lastName == "":
        raise HTTPException(status_code=400, detail="First or last name is empty")

    if len(user_change_name.firstName) > 64 or len(user_change_name.lastName) > 64:
        raise HTTPException(status_code=400, detail="First or last name is too long")

    current_user.first_name = user_change_name.firstName
    current_user.last_name = user_change_name.lastName
    session.add(current_user)
    await session.commit()
    return


@router.post("/me/change-pronouns")
async def change_current_user_pronouns(
    user_change_pronouns: UserChangePronounsRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.PermittedUserChecker(PERMISSIONS_NONE)),
):
    """Update current user's pronouns"""
    current_user.pronouns = user_change_pronouns.pronouns
    session.add(current_user)
    await session.commit()
    return


@router.post("/me/change-details")
async def change_current_user_details(
    user_change_details: UserChangeDetailsRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.PermittedUserChecker(PERMISSIONS_NONE)),
):
    if user_change_details.major == "":
        raise HTTPException(status_code=400, detail="Major cannot be empty")

    current_user.major = user_change_details.major
    current_user.gender_identity = user_change_details.genderIdentity
    session.add(current_user)
    await session.commit()
    return


@router.get("/users/all")
async def get_all_users(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_SEE_USERS})
    ),
):
    return [
        {
            "account_id": user.id,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "pronouns": user.pronouns,
            "RCSID": user.RCSID,
            "RIN": user.RIN,
            "isActive": user.active,
        }
        for user in list((await session.scalars(select(User))).all())
    ]


@router.post("/users/create", response_model=UserResponse)
async def register_new_user(
    new_user: UserCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
):
    """Create new user"""
    result = await session.execute(select(User).where(User.RCSID == new_user.RCSID))
    if result.scalars().first() is not None:
        raise HTTPException(status_code=409, detail="RCSID is in use")

    result = await session.execute(select(User).where(User.RIN == new_user.RIN))
    if result.scalars().first() is not None:
        raise HTTPException(status_code=409, detail="RIN is already in use")

    user = User(
        RCSID=new_user.RCSID,
        RIN=new_user.RIN,
        first_name=new_user.firstName,
        last_name=new_user.lastName,
        gender_identity=new_user.genderIdentity,
        major=new_user.major,
        pronouns=new_user.pronouns,
        hashed_password=get_password_hash(new_user.password),
        is_graduating=False,
        is_rpi_staff=False,
        active=False,
    )
    session.add(user)
    await session.commit()
    return UserResponse(
        RCSID=user.RCSID, firstName=user.first_name, lastName=user.last_name
    )


@router.post("/users/edit/RCSID")
async def change_user_RCSID(
    request: UserChangeRCSIDRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_USER_CORE_INFO})
    ),
):
    "Modifies RCSID of target user. Invalidates active session tokens."

    target = await session.scalar(
        select(User).where(User.RCSID == request.target_RCSID)
    )
    if not target:
        raise HTTPException(status_code=404, detail="Target User Not Found")

    conflicting_user = await session.scalar(
        select(User).where(User.RCSID == request.new_RCSID)
    )
    if conflicting_user:
        raise HTTPException(
            status_code=409, detail="User with new RCSID already exists"
        )

    target.RCSID = request.new_RCSID
    await session.commit()


@router.post("/users/edit/RIN")
async def change_user_RIN(
    request: UserChangeRINRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_EDIT_USER_CORE_INFO})
    ),
):
    """Modifies RIN of target user."""

    target = await session.scalar(
        select(User).where(User.RCSID == request.target_RCSID)
    )
    if not target:
        raise HTTPException(status_code=404, detail="Target User Not Found")

    conflicting_user = await session.scalar(
        select(User).where(User.RIN == request.new_RIN)
    )
    if conflicting_user:
        raise HTTPException(status_code=409, detail="User with new RIN already exists")

    target.RIN = request.new_RIN
    await session.commit()


@router.post("/users/delete")
async def delete_user(
    request: UserDeleteRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_DELETE_USERS})
    ),
):
    """Deletes target user."""

    target = await session.scalar(
        select(User).where(User.RCSID == request.target_RCSID)
    )
    if not target:
        raise HTTPException(status_code=404, detail="Target User Not Found")

    await session.delete(target)
    await session.commit()


@router.post("/users/roles/add")
async def add_role_to_user(
    request: UserAddRoleRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CHANGE_USER_ROLES})
    ),
):
    user = await session.scalar(select(User).where(User.id == request.user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User with provided ID not found")

    role = await session.scalar(select(Role).where(Role.id == request.role_id))
    if not role:
        raise HTTPException(status_code=404, detail="Role with provided ID not found")

    if any(
        restricted_permission in (role.permissions + role.inverse_permissions)
        for restricted_permission in RESTRICTED_PERMISSIONS
    ) and not utils.has_permission(session, current_user.id, Permissions.IS_SUPERUSER):
        raise HTTPException(
            status_code=403,
            detail="Roles with restricted-level permissions may only be added or removed by a superuser",
        )
