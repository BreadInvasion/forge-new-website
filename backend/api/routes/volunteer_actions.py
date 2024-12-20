
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.machine import Machine
from models.user import User
from schemas.enums import Permissions

from ..deps import DBSession, PermittedUserChecker

router = APIRouter()

@router.post("/clear/{machine_id}")
async def clear_machine(
    machine_id: UUID4,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CLEAR_MACHINES}))
    ],
):
    """Clears the active usage of the machine with the provided ID."""

    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == machine_id)
        .options(selectinload(Machine.active_usage))
    )
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find a machine with the provided ID",
        )
    
    if not machine.active_usage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This machine does not have an active usage",
        )