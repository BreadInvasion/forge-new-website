from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload

from models.audit_log import AuditLog
from models.machine import Machine
from models.semester import Semester
from models.state import State
from models.user import User
from schemas.enums import LogType, Permissions, SemesterType
from schemas.requests import ActivateSemesterRequest
from schemas.responses import CreateResponse

from ..deps import DBSession, PermittedUserChecker

router = APIRouter()


@router.post("/exec/next_semester")
async def advance_semester(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CHANGE_SEMESTER}))
    ],
):
    """Move to the next semester chronologically, creating it if it doesn't already exist."""

    state = await session.scalar(
        select(State).options(selectinload(State.active_semester))
    )
    if not state or not state.active_semester:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can't advance the semester with no active semester!",
        )

    season_increment: dict[SemesterType, SemesterType] = {
        SemesterType.SPRING: SemesterType.SUMMER,
        SemesterType.SUMMER: SemesterType.FALL,
        SemesterType.FALL: SemesterType.SPRING,
    }
    next_season = season_increment[state.active_semester.semester_type]
    next_year = state.active_semester.calendar_year
    if next_season == SemesterType.SPRING:
        next_year += 1

    next_semester = await session.scalar(
        select(Semester).where(
            and_(
                Semester.semester_type == next_season,
                Semester.calendar_year == next_year,
            )
        )
    )
    if not next_semester:
        next_semester = Semester(semester_type=next_season, calendar_year=next_year)

    state.active_semester = next_semester
    session.add(state)
    await session.commit()

    audit_log = AuditLog(
        type=LogType.ACTIVE_SEMESTER_CHANGED,
        content={
            "semester_id": str(next_semester.id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=next_semester.id)


@router.post("/exec/set_semester")
async def set_semester(
    request: ActivateSemesterRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CHANGE_SEMESTER}))
    ],
):
    """Make the semester with the provided semester_id the active semester."""

    state = await session.scalar(select(State))
    if not state:
        raise HTTPException(
            status_code=status.HTTP_418_IM_A_TEAPOT,
            detail="There's no server state object. How did we get here?",
        )

    new_semester = await session.scalar(
        select(Semester).where(Semester.id == request.semester_id)
    )
    if not new_semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find a semester with the provided ID",
        )

    state.active_semester = new_semester
    session.add(state)
    await session.commit()

    audit_log = AuditLog(
        type=LogType.ACTIVE_SEMESTER_CHANGED,
        content={"semester_id": str(new_semester.id), "user_rcsid": current_user.RCSID},
    )
    session.add(audit_log)
    await session.commit()
