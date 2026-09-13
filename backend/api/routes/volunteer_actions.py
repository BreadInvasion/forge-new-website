from datetime import datetime
from typing import Annotated
from azure.communication.email import EmailClient
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.config import settings
from models.audit_log import AuditLog
from models.machine import Machine
from models.machine_usage import MachineUsage
from models.user import User
from schemas.enums import LogType, Permissions

from ..deps import DBSession, PermittedUserChecker

router = APIRouter()


async def send_failure_email(email: str, machine_name: str):
    client = EmailClient.from_connection_string(
        settings.AZURE_COMMUNICATION_CONNECTION_STRING
    )

    message = {
        "senderAddress": "DoNotReply@notifications.rpiforge.dev",
        "recipients": {
            "to": [{"address": email}]
        },
        "content": {
            "subject": "Your Machine Usage Failed",
            "plainText": (
                f"Unfortunately, your machine usage on {machine_name} has failed. You may want to stop by the Forge and try again (A reprint is free)."
            ),
        },
    }

    poller = client.begin_send(message)
    result = poller.result()
    if result["status"] != "Succeeded" or result["error"] is not None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to send machine usage failure email.",
        )


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

    audit_log = AuditLog(
        type=LogType.MACHINE_USAGE_CLEARED,
        content={
            "machine_usage_id": str(machine.active_usage.id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)

    machine.active_usage = None
    session.add(machine)
    await session.commit()


@router.post("/fail/{machine_id}")
async def fail_machine(
    machine_id: UUID4,
    session: DBSession,
    current_user: Annotated[
        User, Depends(PermittedUserChecker({Permissions.CAN_FAIL_MACHINES}))
    ],
):
    """Fails the active usage of the machine with the provided ID."""

    machine = await session.scalar(
        select(Machine)
        .where(Machine.id == machine_id)
        .options(
            selectinload(Machine.active_usage).selectinload(MachineUsage.user)
        )
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

    audit_log = AuditLog(
        type=LogType.MACHINE_USAGE_FAILED,
        content={
            "machine_usage_id": str(machine.active_usage.id),
            "user_rcsid": current_user.RCSID,
        },
    )
    session.add(audit_log)

    machine.active_usage.failed = True
    machine.active_usage.failed_at = datetime.now()
    session.add(machine)
    await session.commit()

    await send_failure_email(
        f"{machine.active_usage.user.RCSID}@rpi.edu",
        machine.name,
    )

    # TODO response
