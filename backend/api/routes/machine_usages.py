""" Machine Usage endpoints. """

from typing import Annotated, Literal
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import InstrumentedAttribute, selectinload

from models.machine import Machine
from models.machine_usage import MachineUsage
from schemas.responses import UsageResponse

from ..deps import DBSession, PermittedUserChecker
from models.user import User

router = APIRouter()

@router.get("/usages/me")
async def get_my_usages(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker(set()))
    ],
    limit: int = 20,
    offset: int = 0,
    order_by: Literal[
        "time_started",
        "cost",
        "name",
    ] = "time_started",
    descending: bool = False,
):
    """Fetch machine usage records for current user."""

    attr_key_map: dict[str, InstrumentedAttribute] = {
        "time_started": MachineUsage.time_started,
        "duration": MachineUsage.duration_seconds,
        "cost": MachineUsage.cost,
        "name": Machine.name,
    }
    order_determinant = attr_key_map[order_by]
    if descending:
        order_determinant = order_determinant.desc()

    machine_usages = (
        await session.scalars(
            select(MachineUsage)
            .join(MachineUsage.machine)
            .options(selectinload(MachineUsage.machine))
            .options(selectinload(MachineUsage.semester))
            .where(MachineUsage.user_id == current_user.id)
            .order_by(order_determinant)
            .offset(offset)
            .fetch(limit)
        )
    ).all()

    return [
        UsageResponse(
            machine_name=usage.machine.name,
            semester=f"{usage.semester.semester_type} {usage.semester.calendar_year}" if usage.semester else None,
            time_started=usage.time_started,
            duration=usage.duration_seconds,
            cost=usage.cost,
        )
        for usage in machine_usages
    ]


@router.get("/usages/current/me")
async def get_my_usages(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker(set()))
    ],
):
    """Fetch current machine usages for current user."""

    machine_usages = (
        await session.scalars(
            select(MachineUsage)
            .join(MachineUsage.machine)
            .options(selectinload(MachineUsage.machine))
            .options(selectinload(MachineUsage.semester))
            .where(MachineUsage.user_id == current_user.id)
            .where(Machine.active_usage)
        )
    ).all()

    return [
        UsageResponse(
            machine_name=usage.machine.name,
            semester=f"{usage.semester.semester_type} {usage.semester.calendar_year}" if usage.semester else None,
            time_started=usage.time_started,
            duration=usage.duration_seconds,
            cost=usage.cost,
        )
        for usage in machine_usages
    ]