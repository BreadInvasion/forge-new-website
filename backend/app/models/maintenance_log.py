from datetime import datetime
from uuid import uuid4
from pydantic import UUID4
from sqlmodel import Field, Relationship, SQLModel

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.machine import Machine


class MaintenanceLogBase(SQLModel):
    """Base data for maintenance logs. SafeForUsers: PRIVILEGED"""

    # Submission date of the given maintenance log
    created_at: datetime

    # Details of the maintenance log (custom input)
    contents: str

    # Was the machine removed from service with this log?
    removed_from_service: bool

    # Was the machine returned to service after this maintenance?
    returned_to_service: bool


class MaintenanceLog(MaintenanceLogBase, table=True):
    """Database model for maintenance logs. SafeForUsers: NEVER"""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)

    # Author of the maintenance log
    author: "User" = Relationship()

    # The machine this maintenance was performed on
    machine: "Machine" = Relationship(back_populates="maintenance_logs")
    machine_id: UUID4 = Field(foreign_key="machine.id")
