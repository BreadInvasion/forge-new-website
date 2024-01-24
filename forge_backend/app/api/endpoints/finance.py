from io import BytesIO
from typing import List, Tuple
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import UUID4
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import Organization, Semester, User, MachineUsage
from app.schemas.requests import (
    GetChargeSheetsRequest,
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
from app.schemas.enums import Permissions, SemesterType

from xlsxwriter import Workbook

router = APIRouter()


def semester_formatted(semester: Semester):
    """Provides current semester formatted as <season>YY"""

    output = ""
    match semester.semester_type:
        case SemesterType.FALL:
            output += "fall"
        case SemesterType.SPRING:
            output += "spring"
        case SemesterType.SUMMER:
            output += "summer"

    output += str(semester.calendar_year)[-2:]  # Get last two digits of current year
    return output


async def generate_charge_sheets_for_semester(
    semester_id: UUID4, session: AsyncSession
) -> StreamingResponse:
    """Generates charge sheets for provided semester"""

    semester = await session.scalar(select(Semester).where(Semester.id == semester_id))
    if not semester:
        raise HTTPException(
            status_code=400,
            detail="Semester with provided ID not found",
        )

    non_graduating: List[Tuple[str, str, str, float]] = list(
        (
            await session.scalars(
                select(
                    User.first_name,
                    User.last_name,
                    User.RIN,
                    func.sum(MachineUsage.cost),
                ).where(
                    User.is_graduating == False,
                    User.is_rpi_staff == False,
                    MachineUsage.user_id == User.id,
                    MachineUsage.semester_id == semester_id
                    # We check all usages without regard for failure state,
                    # because the reprints should have been marked as such and cost 0.
                )
            )
        ).all()
    )

    graduating: List[Tuple[str, str, str, float]] = list(
        (
            await session.scalars(
                select(
                    User.first_name,
                    User.last_name,
                    User.RIN,
                    func.sum(MachineUsage.cost),
                ).where(
                    User.is_graduating == True,
                    User.is_rpi_staff == False,
                    MachineUsage.user_id == User.id,
                    MachineUsage.semester_id == semester_id,
                )
            )
        ).all()
    )

    organizations: List[Tuple[str, float]] = list(
        (
            await session.scalars(
                select(
                    Organization.org_name,
                    func.sum(MachineUsage.cost),
                ).where(
                    MachineUsage.organization_id == Organization.id,
                    MachineUsage.semester_id == semester_id,
                )
            )
        ).all()
    )

    output = BytesIO()

    charge_sheets = Workbook(output)
    non_graduating_worksheet = charge_sheets.add_worksheet("Non-Graduating")

    non_graduating_formatted = [
        (first + " " + last, rin, charges)
        for first, last, rin, charges in non_graduating
    ]
    for row, line in enumerate(non_graduating_formatted):
        for col, cell in enumerate(line):
            non_graduating_worksheet.write(row, col, cell)

    graduating_worksheet = charge_sheets.add_worksheet("Graduating")

    graduating_formatted = [
        (first + " " + last, rin, charges) for first, last, rin, charges in graduating
    ]
    for row, line in enumerate(graduating_formatted):
        for col, cell in enumerate(line):
            graduating_worksheet.write(row, col, cell)

    charge_sheets.close()

    output.seek(0)

    headers = {
        "Content-Disposition": f'attachment; filename="charge_sheets_{semester_formatted(semester)}.xlsx"'
    }
    return StreamingResponse(output, headers=headers)


@router.get("/finance/charges")
async def generate_charge_sheets(
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_GET_CHARGES})
    ),
):
    """Generates charge sheets for the active semester"""

    semester_id = await session.scalar(
        select(Semester.id).where(Semester.active == True)
    )
    if not semester_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot get current semester charges with no active semester",
        )

    return await generate_charge_sheets_for_semester(semester_id, session)


@router.post("/finance/charges")
async def generate_charge_sheets_by_semester(
    request: GetChargeSheetsRequest,
    session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(
        deps.PermittedUserChecker({Permissions.CAN_GET_CHARGES})
    ),
):
    return await generate_charge_sheets_for_semester(request.semester_id, session)
