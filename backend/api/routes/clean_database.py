from typing import Annotated
from datetime import datetime, timedelta
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select, desc
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from models.machine_usage import MachineUsage
from models.auth_token import AuthToken
from schemas.enums import LogType, Permissions
from schemas.responses import AuditLogModel

router = APIRouter()

async def delete_user(
    user_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_USERS}))
    ],
):  
    target_user = await session.scalar(select(User).where(User.id == user_id))
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with provided ID not found",
        )
    
    usages = (
        await session.scalars(
            select(MachineUsage).where(MachineUsage.user_id == user_id)
        )
    ).all()
    
    for usage in usages:
        await session.delete(usage)

    authtokens = (
        await session.scalars(
            select(AuthToken).where(AuthToken.user_id == user_id)
        )
    ).all()

    for authtoken in authtokens:
        await session.delete(authtoken)

    await session.delete(target_user)

    audit_log = AuditLog(
        type=LogType.USER_DELETED,
        content={"target_user_rcsid": target_user.RCSID, "user_rcsid": current_user.RCSID}
    )
    session.add(audit_log)

    await session.commit()

@router.post("/clean")
async def clean_database(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CLEAN_DATABASE}))
    ]
):
    users_to_be_deleted = (
        await session.scalars(
            select(User)
            .where(User.last_login < (datetime.now() - timedelta(days = 4 * 365.25)))
            .options(selectinload(User.roles))
        )
    ).all()

    invalid_users = 0

    for user in users_to_be_deleted:
        valid = True
        for role in user.roles:
            if role.name == "Super Admin":
                valid = False
                invalid_users += 1
                break
        if valid:
            await delete_user(user_id=user.id, session=session, current_user=current_user)

    audit_log = AuditLog(
        type=LogType.DATABASE_CLEANED,
        content={"num_users_deleted": len(users_to_be_deleted) - invalid_users,
                 "user_rcsid": current_user.RCSID}
    )
    session.add(audit_log)
    await session.commit()
