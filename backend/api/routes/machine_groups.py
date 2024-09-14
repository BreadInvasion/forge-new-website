""" Machine Type endpoints. """

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.machine import Machine
from models.machine_group import MachineGroup
from schemas.requests import MachineGroupCreateRequest, MachineGroupEditRequest
from schemas.responses import CreateResponse, MachineInfo, MachineInfoGroup

from ..deps import DBSession, PermittedUserChecker
from models.user import User
from schemas.enums import Permissions

router = APIRouter()


@router.post("/machinegroups/new")
async def create_machine_group(
    request: MachineGroupCreateRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_CREATE_MACHINE_GROUPS}))
    ],
):
    "Create a new machine type with the provided name and resource slots."

    existing_machine_group = await session.scalar(
        select(MachineGroup).where(MachineGroup.name == request.name)
    )
    if existing_machine_group:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A machine group with that name already exists",
        )

    new_machine_group = MachineGroup(name=request.name)
    session.add(new_machine_group)
    await session.commit()
    await session.refresh(new_machine_group)
    return CreateResponse(id=new_machine_group.id)


@router.get("/machinegroups/{group_id}")
async def get_machine_group(
    group_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_GROUPS}))
    ],
):
    "Fetch the machine group with the provided ID."

    machine_group = await session.scalar(
        select(MachineGroup)
        .where(MachineGroup.id == group_id)
        .options(selectinload(MachineGroup.machines).subqueryload(Machine.active_usage))
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine group with provided ID not found",
        )

    return MachineInfoGroup(
        group_name=machine_group.name,
        machines=[
            MachineInfo(
                id=machine.id,
                name=machine.name,
                is_in_use=machine.active_usage is not None,
                is_failed=(
                    machine.active_usage.failed if machine.active_usage else False
                ),
            )
            for machine in machine_group.machines
        ],
    )


@router.get("/machinegroups")
async def get_all_machine_groups(
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_GROUPS}))
    ],
):
    "Fetch all machine groups."

    machine_groups = (await session.scalars(select(MachineGroup))).all()

    return [
        MachineInfoGroup(
            group_name=machine_group.name,
            machines=[
                MachineInfo(
                    id=machine.id,
                    name=machine.name,
                    is_in_use=machine.active_usage is not None,
                    is_failed=(
                        machine.active_usage.failed if machine.active_usage else False
                    ),
                )
                for machine in machine_group.machines
            ],
        )
        for machine_group in machine_groups
    ]


@router.post("/machinegroups/edit")
async def edit_machine_group(
    request: MachineGroupEditRequest,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_EDIT_MACHINE_GROUPS}))
    ],
):
    """Update the machine group with the provided ID."""

    machine_group = await session.scalar(
        select(MachineGroup)
        .where(MachineGroup.id == request.machine_group_id)
        .options(selectinload(MachineGroup.machines).subqueryload(Machine.active_usage))
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine group with provided ID not found",
        )
    
    machines = (await session.scalars(select(Machine).where(Machine.id.in_(request.machine_ids)))).all()
    if len(machines) != len(request.machine_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more of the provided machine IDs is invalid"
        )
    
    machine_group.name = request.name
    machine_group.machines = list(machines)
    await session.commit()


@router.delete("/machinegroups/{group_id}")
async def delete_machine_group(
    group_id: UUID,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_SEE_MACHINE_GROUPS}))
    ],
):
    "Delete the machine group with the provided ID."

    machine_group = await session.scalar(
        select(MachineGroup)
        .where(MachineGroup.id == group_id)
        .options(selectinload(MachineGroup.machines))
    )
    if not machine_group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine group with provided ID not found",
        )
    
    if len(machine_group.machines):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a group that contains machines"
        )

    await session.delete(machine_group)
    await session.commit()