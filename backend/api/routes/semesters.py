""" Semester endpoints. """

from typing import Annotated, Literal, Mapping
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import Case, and_, case, func, select
from sqlalchemy.orm import InstrumentedAttribute

from models.audit_log import AuditLog
from models.machine_usage import MachineUsage
from models.semester import Semester
from schemas.requests import SemesterCreateRequest, SemesterEditRequest
from schemas.responses import (
    AuditLogModel,
    CreateResponse,
    SemesterDetails,
    SemesterInfo,
)

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import LogType, Permissions, SemesterType

router = APIRouter()


@router.post("/semesters/new")
async def create_semester(
    request: SemesterCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_SEMESTERS}))
    ],
):
    """Create a new semester object with the provided information. This will NOT activate the new semester."""

    existing_semester = await session.scalar(
        select(Semester).where(
            and_(
                Semester.semester_type == request.semester_type,
                Semester.calendar_year == request.calendar_year,
            )
        )
    )
    if existing_semester:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A semester for that season/year combination already exists",
        )

    new_semester = Semester(
        semester_type=request.semester_type,
        calendar_year=request.calendar_year,
    )
    session.add(new_semester)
    await session.commit()
    await session.refresh(new_semester)

    audit_log = AuditLog(
        type=LogType.SEMESTER_CREATED,
        content={
            "semester_id": str(new_semester.id),
            "user_rcsid": current_user.RCSID,
            "props": request.model_dump(mode="json"),
        },
    )
    session.add(audit_log)
    await session.commit()

    return CreateResponse(id=new_semester.id)


@router.get("/semesters/{semester_id}")
async def get_semester(
    semester_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_SEMESTERS}))
    ],
):
    """Fetch the semester with the provided ID."""

    semester = await session.scalar(select(Semester).where(Semester.id == semester_id))
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester with provided ID not found",
        )

    audit_logs = (
        await session.scalars(
            select(AuditLog)
            .where(
                and_(
                    AuditLog.content.op("?")("semester_id"),
                    AuditLog.content["semester_id"] == semester_id,
                )
            )
            .order_by(AuditLog.time_created.desc())
        )
    ).all()

    return SemesterDetails(
        audit_logs=[AuditLogModel.model_validate(log) for log in audit_logs],
        **semester.__dict__,
    )


@router.get("/semesters")
async def get_all_semesters(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_SEMESTERS}))
    ],
    limit: int = 20,
    offset: int = 0,
    order_by: Literal["season", "year"] = "year",
    descending: bool = False,
):
    """Fetch all semesters."""

    season_sorting: Mapping[SemesterType, int] = {
        SemesterType.SPRING: 0,
        SemesterType.SUMMER: 1,
        SemesterType.FALL: 2,
    }

    attr_key_map: dict[str, InstrumentedAttribute | Case] = {
        "season": case(season_sorting, value=Semester.semester_type),
        "year": Semester.calendar_year,
    }
    order_determinant = attr_key_map[order_by]
    order_secondary = (
        Semester.calendar_year if order_by == "season" else attr_key_map["season"]
    )
    if descending:
        order_determinant = order_determinant.desc()
        order_secondary = order_secondary.desc()

    semesters = (
        await session.scalars(
            select(Semester)
            .order_by(order_determinant, order_secondary)
            .offset(offset)
            .fetch(limit)
        )
    ).all()

    return [SemesterInfo(**semester.__dict__) for semester in semesters]


@router.post("/semesters/{semester_id}")
async def edit_semester(
    semester_id: UUID,
    request: SemesterEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_SEMESTERS}))
    ],
):
    """Update the semester with the provided ID."""

    semester = await session.scalar(select(Semester).where(Semester.id == semester_id))
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester with provided ID not found",
        )

    conflict = await session.scalar(
        select(Semester).where(
            and_(
                Semester.semester_type == request.semester_type,
                Semester.calendar_year == request.calendar_year,
            )
        )
    )
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="There is already a semester with that season/year combination",
        )

    differences = {
        "semester_type": (
            request.semester_type
            if semester.semester_type != request.semester_type
            else None
        ),
        "calendar_year": (
            request.calendar_year
            if semester.calendar_year != request.calendar_year
            else None
        ),
    }

    semester.semester_type = request.semester_type
    semester.calendar_year = request.calendar_year

    audit_log = AuditLog(
        type=LogType.SEMESTER_EDITED,
        content={
            "semester_id": str(semester_id),
            "user_rcsid": current_user.RCSID,
            "changed_values": differences,
        },
    )
    session.add(audit_log)

    await session.commit()


@router.delete("/semesters/{semester_id}")
async def delete_semester(
    semester_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_DELETE_SEMESTERS}))
    ],
):
    """Delete the semester with the provided ID."""

    semester = await session.scalar(select(Semester).where(Semester.id == semester_id))
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester with provided ID not found",
        )

    usages_in_semester = await session.scalar(
        select(func.count())
        .select_from(MachineUsage)
        .where(MachineUsage.semester_id == semester_id)
    )
    if usages_in_semester:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can't delete a semester that has usages associated with it",
        )

    await session.delete(semester)

    audit_log = AuditLog(
        type=LogType.SEMESTER_DELETED,
        content={
            "semester_id": str(semester_id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)

    await session.commit()
