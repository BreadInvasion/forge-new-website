from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel

from typing import TYPE_CHECKING

from pydantic import UUID4
from uuid import uuid4

from app.enums import MachineUsageStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.org import Org
    from app.models.semester import Semester


class MachineUsageBase(SQLModel):
    """Base data for machine usage logs. SafeForUsers: YES"""

    # Datetime representation of the start and end times of the usage
    start_time: datetime
    end_time: datetime

    # Cost of usage in dollars, calculated at time of log.
    cost: float

    # Overriden cost in dollars, if any, adjusted by a manager or admin.
    cost_override: float | None = None
    # The user who performed the override, if one occurred.
    overridden_by: User | None = Relationship()

    # Completion/failure status of usage
    status: MachineUsageStatus

    # The time at which this usage was cleared from the machine, if any
    cleared_at: datetime | None


class MachineUsage(MachineUsageBase, table=True):
    """Database model for machine usage logs. SafeForUsers: NEVER"""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)

    # The user who logged this usage
    user: "User" = Relationship(back_populates="machine_usages")
    user_id: UUID4 = Field(foreign_key="user.id")

    # Org being charged, if any
    org: "Org" | None = Relationship(back_populates="machine_usages")
    org_id: UUID4 | None = Field(default=None, foreign_key="org.id")

    # Which semester the usage occurred in
    semester: "Semester" = Relationship(back_populates="machine_usages")
    semester_id: UUID4 = Field(foreign_key="semester.id")
