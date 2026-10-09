from typing import Annotated
from datetime import datetime, timedelta
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select, desc
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions
from schemas.responses import AuditLogModel
from .users import delete_user

router = APIRouter()

"""Plan: 
        1) Use Alembic to allow USER_LOGIN as a valid LogType -- DONE!!!
        2) Modify auth.py/login to log USER_LOGINS -- DONE!!
        4) Implement delete user in users.py -- DONE!!
        5) Make a security check (target not superuser & user valid target) -- DONE!!
        7) Allow a way to enact the clean or make it an automatic call upon semester change
        8) Clean up auth.py so logins don't cause huge amounts of bloat -> keep track of most recent only
        """

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
