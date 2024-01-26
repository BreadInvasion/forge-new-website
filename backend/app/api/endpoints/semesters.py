from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select, update
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    MachineType,
    MachineUsage,
    MaterialGroup,
    MaterialUsageQuantity,
    Organization,
    Semester,
    User,
    Machine,
)
from app.schemas.responses import AllMachineInfoResponse, MachineInfo, MachineInfoGroup
from app.schemas.requests import (
    MaterialCreateRequest,
    MaterialEditRequest,
    MaterialDeleteRequest,
    SemesterCreateRequest,
)
from app.schemas.enums import Permissions, SemesterType

router = APIRouter()


def cycle_semester_type(current: SemesterType) -> SemesterType:
    match current:
        case SemesterType.FALL:
            return SemesterType.SPRING
        case SemesterType.SPRING:
            return SemesterType.SUMMER
        case SemesterType.SUMMER:
            return SemesterType.FALL


@router.get("/semesters")
async def get_all_semesters(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_SEE_SEMESTERS})
    ),
):
    return [
        {
            "semesterID": id,
            "semesterType": semester_type,
            "calendarYear": calendar_year,
            "active": is_active,
        }
        for id, semester_type, calendar_year, is_active in (
            await session.scalars(
                select(
                    Semester.id,
                    Semester.semester_type,
                    Semester.calendar_year,
                    Semester.active,
                )
            )
        ).all()
    ]


@router.post("/semesters/next")
async def go_next_semester(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CHANGE_SEMESTER})
    ),
):
    active_semester = await session.scalar(
        select(Semester).where(Semester.active == True)
    )

    if not active_semester:
        raise HTTPException(status_code=404, detail="No active semester found")

    new_semester_type = cycle_semester_type(active_semester.semester_type)
    new_semester_year = active_semester.calendar_year
    if new_semester_type == SemesterType.SPRING:
        new_semester_year += 1

    active_semester.active = False
    new_semester = Semester(
        semester_type=new_semester_type, calendar_year=new_semester_year, active=True
    )
    session.add(new_semester)
    await session.execute(update(User).values(active=False))
    await session.execute(update(Organization).values(active=False))
    await session.commit()


@router.post("/semesters/create")
async def create_new_semester(
    request: SemesterCreateRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_CHANGE_SEMESTER})
    ),
):
    conflicting_semester = await session.scalar(
        select(Semester).where(
            Semester.semester_type == request.semester_type,
            Semester.calendar_year == request.calendar_year,
        )
    )
    if conflicting_semester:
        raise HTTPException(
            status_code=409,
            detail="A semester with that season and year already exists",
        )

    current_semester = await session.scalar(
        select(Semester).where(Semester.active == True)
    )
    if current_semester:
        current_semester.active = False

    new_semester = Semester(
        semester_type=request.semester_type,
        calendar_year=request.calendar_year,
        active=True,
    )
    session.add(new_semester)
    await session.execute(update(User).values(active=False))
    await session.execute(update(Organization).values(active=False))
    await session.commit()
