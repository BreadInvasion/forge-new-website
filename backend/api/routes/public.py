from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.machine import Machine
from models.machine_usage import MachineUsage
from schemas.responses import (
    AllMachinesStatusResponse,
    MachineInfo,
    MachineStatus,
    MachineStatusGroup,
)
from ..deps import DBSession

from itertools import groupby

router = APIRouter()


@router.get("/machinestatus")
async def get_machines_status(
    session: DBSession,
):
    "Fetch all machines."

    machines = (
        await session.scalars(
            select(Machine)
            .options(selectinload(Machine.active_usage).selectinload(MachineUsage.user))
            .options(selectinload(Machine.group))
            .options(selectinload(Machine.type))
        )
    ).all()

    group_dict = {}
    for machine in machines:
        key = machine.group_id if machine.group_id is not None else ""
        group_dict.setdefault(key, []).append(machine)

    group_list = []
    loner_list = []
    for _, group in group_dict.items():
        machines = list(group)
        machines.sort(key=lambda machine: machine.name)

        machine_statuses = [
            MachineStatus.model_validate(
                {
                    "in_use": machine.active_usage is not None,
                    "failed": (
                        machine.active_usage.failed if machine.active_usage else False
                    ),
                    "failed_at": (
                        machine.active_usage.failed_at if machine.active_usage else None
                    ),
                    "usage_start": (
                        machine.active_usage.time_started
                        if machine.active_usage
                        else None
                    ),
                    "usage_duration": (
                        machine.active_usage.duration_seconds
                        if machine.active_usage
                        else None
                    ),
                    "user_name": (
                        f"{machine.active_usage.user.first_name} {machine.active_usage.user.last_name[0]}."
                        if machine.active_usage and machine.active_usage.user
                        else None
                    ),
                    **machine.__dict__,
                }
            )
            for machine in machines
        ]

        first_machine = machines[0]
        # We portray it like this just to make linter happy
        if first_machine.group is None:
            loner_list = machine_statuses
        else:
            group_list.append(
                MachineStatusGroup(
                    name=first_machine.group.name,
                    machines=machine_statuses,
                )
            )

    return AllMachinesStatusResponse(groups=group_list, loners=loner_list)
