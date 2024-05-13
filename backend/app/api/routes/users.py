from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import func, select, or_

from app import crud
from app.api.deps import (
    PermittedUserChecker,
    SessionDep,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.enums import Permission
from app.models.user import User, UserBase, UserPrivate
from app.models.user_requests import (
    CreateUserRequest,
    UpdateUserPasswordRequest,
    UsersResponse,
)
from app.utils import generate_email_token, generate_new_account_email, send_email

router = APIRouter()


@router.get(
    "/users",
    dependencies=[Depends(PermittedUserChecker({Permission.SEE_USERS}))],
    response_model=UsersResponse,
)
async def read_users(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
) -> UsersResponse:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = (await session.exec(count_statement)).one()

    statement = select(User).offset(skip).limit(limit)
    users = list((await session.exec(statement)).all())

    return UsersResponse(count=count, users=users)  # type: ignore


@router.post("/me/change_password")
async def update_password_me(
    *,
    session: SessionDep,
    request: UpdateUserPasswordRequest,
    current_user: Annotated[User, Depends(PermittedUserChecker(None))],
) -> None:
    """
    Update own password.
    """
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if request.current_password == request.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = get_password_hash(request.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    await session.commit()
    return


@router.get("/me", response_model=UserBase)
def read_user_me(
    current_user: Annotated[User, Depends(PermittedUserChecker(None))]
) -> UserBase:
    """
    Get current user.
    """
    return current_user


@router.post("/signup", response_model=UserBase)
async def register_user(session: SessionDep, user_new: CreateUserRequest) -> UserBase:
    """
    Register a new user. User will still require email validation.
    """

    if (
        await session.exec(
            select(User).where(
                or_(User.RCSID == user_new.RCSID, User.RIN == user_new.RIN)
            )
        )
    ).first():
        raise HTTPException(status_code=409, detail="RCSID or RIN already in use")

    user = await crud.create_user(session=session, user_create=user_new)

    activation_token = generate_email_token(
        user.RCSID, settings.EMAIL_ACTIVATION_TOKEN_EXPIRE_HOURS
    )
    email = generate_new_account_email(activation_token)
    send_email(
        email_to=user.RCSID + "@rpi.edu",
        subject=email.subject,
        html_content=email.html_content,
    )

    return user


@router.get(
    "/users/{RCSID}",
    dependencies=[Depends(PermittedUserChecker({Permission.SEE_USERS}))],
)
async def read_user_by_id(
    RCSID: str,
    session: SessionDep,
) -> User | None:
    """
    Get a specific user by id.
    """
    user = await crud.get_user_by_rcsid(session=session, RCSID=RCSID)
    return user


@router.patch(
    "/users/{RCSID}",
    dependencies=[Depends(PermittedUserChecker({Permission.MODIFY_USERS}))],
    response_model=User,
)
async def update_user(
    *,
    session: SessionDep,
    RCSID: str,
    user_new: UserPrivate,
) -> Any:
    """
    Update a user.
    """

    db_user = await crud.get_user_by_rcsid(session=session, RCSID=RCSID)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_new.RCSID != db_user.RCSID and await crud.get_user_by_rcsid(
        session=session, RCSID=user_new.RCSID
    ):
        raise HTTPException(
            status_code=409, detail="A user with that RCSID already exists"
        )
    if user_new.RIN != db_user.RIN and await crud.get_user_by_rin(
        session=session, RIN=user_new.RIN
    ):
        raise HTTPException(
            status_code=409, detail="A user with that RIN already exists"
        )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_new)
    return db_user


@router.delete(
    "/users/{RCSID}",
    dependencies=[Depends(PermittedUserChecker({Permission.MODIFY_USERS}))],
)
async def delete_user(session: SessionDep, RCSID: str) -> None:
    """
    Soft-delete a user. Hard delete is only possible in-console.
    """

    user = await crud.get_user_by_rcsid(session=session, RCSID=RCSID)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_deleted = True
    session.add(user)
    await session.commit()


@router.delete("/me")
async def delete_self(
    session: SessionDep,
    current_user: Annotated[User, Depends(PermittedUserChecker(None))],
):
    """
    Soft-delete the user's account. Hard delete is only possible in-console.
    """

    current_user.is_deleted = True
    session.add(current_user)
    await session.commit()
