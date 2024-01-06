from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import User, Machine
from app.schemas.responses import AllMachineInfoResponse, MachineInfo, MachineInfoGroup

router = APIRouter()

@router.get("/machines")
async def get_machines_list(session: AsyncSession = Depends(deps.get_session)):
    machines = set((await session.scalars(select(Machine).options(joinedload(Machine.type), joinedload(Machine.active_usage)))).all())

    machine_groups: Dict[str, List[MachineInfo]] = {}

    for machine in machines:
        machine_info = MachineInfo(id=machine.id, name=machine.name, is_in_use=machine.active_usage is not None, usage_status=(None if not machine.active_usage else machine.active_usage.status))

        if not machine.type.name in machine_groups:
            machine_groups[machine.type.name] = [machine_info]
        else:
            machine_groups[machine.type.name].append(machine_info)
    
    return AllMachineInfoResponse(groups=[MachineInfoGroup(group_name=key, machines=val) for key, val in machine_groups.items()])

@router.post("/machines/use")
async def use_machine(session: AsyncSession = Depends(deps.get_session),
    current_user: User = Depends(deps.get_current_user),):
    