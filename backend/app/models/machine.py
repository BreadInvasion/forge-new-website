from datetime import datetime
from uuid import uuid4
from pydantic import UUID4
from sqlmodel import Field, Relationship, SQLModel

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.machine_type import MachineType
    from app.models.machine_usage import MachineUsage
    from app.models.maintenance_log import MaintenanceLog


class MachineBase(SQLModel):
    """Base data for machines. SafeForUsers: YES"""

    # The name of the machine as displayed to users (e.g. "Alpha")
    display_name: str

    # Is the machine out of service?
    out_of_service: bool = False


class MachinePrivate(MachineBase):
    """Privileged data for machines. SafeForUsers: PRIVILEGED"""

    # The name of the machine in the admin panel
    db_name: str
    # The description of the machine in the admin panel
    db_description: str

    # The last time the machine was maintenanced.
    last_maintenanced: datetime


class Machine(MachinePrivate):
    """Database model for machines. SafeForUsers: NEVER"""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)

    # The type of the machine. The machine's type defines its usage behavior.
    machine_type: "MachineType" = Relationship()

    # The currently active machine usage.
    active_usage: "MachineUsage" = Relationship()

    # Maintenance history for this machine.
    maintenance_logs: list["MaintenanceLog"] = Relationship(back_populates="machine")
