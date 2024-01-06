from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import User
from app.schemas.requests import UserChangeDetailsRequest, UserChangeNameRequest, UserChangePronounsRequest, UserCreateRequest, UserUpdatePasswordRequest
from app.schemas.responses import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(deps.get_current_user),
):
    """Get current user"""
    return UserResponse(RCSID=current_user.RCSID, firstName=current_user.first_name, lastName=current_user.last_name)


@router.post("/me/change-password")
async def reset_current_user_password(
    user_update_password: UserUpdatePasswordRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
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
    current_user: User = Depends(deps.get_current_user),
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
    current_user: User = Depends(deps.get_current_user),
):
    """Update current user's pronouns"""
    current_user.pronoun_A = user_change_pronouns.pronounA
    current_user.pronoun_B = user_change_pronouns.pronounB
    session.add(current_user)
    await session.commit()
    return

@router.post("/me/change-details")
async def change_current_user_details(
    user_change_details: UserChangeDetailsRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),
):
    if user_change_details.major == "":
        raise HTTPException(status_code=400, detail="Major cannot be empty")
    
    current_user.major = user_change_details.major
    current_user.gender_identity = user_change_details.genderIdentity
    session.add(current_user)
    await session.commit()
    return

@router.post("/users/create", response_model=UserResponse)
async def register_new_user(
    new_user: UserCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
):
    """Create new user"""
    result = await session.execute(select(User).where(User.RCSID == new_user.RCSID))
    if result.scalars().first() is not None:
        raise HTTPException(status_code=400, detail="RCSID is in use")
    
    result = await session.execute(select(User).where(User.RIN == new_user.RIN))
    if result.scalars().first() is not None:
        raise HTTPException(status_code=400, detail="RIN is already in use")
    
    user = User(
        RCSID=new_user.RCSID,
        RIN=new_user.RIN,
        first_name=new_user.firstName,
        last_name=new_user.lastName,
        gender_identity=new_user.genderIdentity,
        major=new_user.major,
        pronoun_A=new_user.pronounA,
        pronoun_B=new_user.pronounB,
        hashed_password=get_password_hash(new_user.password)
    )
    session.add(user)
    await session.commit()
    return UserResponse(RCSID=user.RCSID, firstName=user.first_name, lastName=user.last_name)
