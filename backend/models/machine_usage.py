from sqlalchemy import ForeignKey
from .base import Base

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import uuid4, UUID

from sqlalchemy import UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .machine import Machine
    from .semester import Semester
    from .user import User
    from .resource_usage_quantity import ResourceUsageQuantity


class MachineUsage(Base):
    __tablename__ = "machine_usages"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    machine_id: Mapped[UUID] = mapped_column(ForeignKey("machines.id"))
    machine: Mapped["Machine"] = relationship(back_populates="active_usage")

    semester_id: Mapped[UUID] = mapped_column(ForeignKey("semesters.id"))
    semester: Mapped["Semester"] = relationship()

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", name="fk_used_by"))
    user: Mapped["User"] = relationship(foreign_keys=[user_id])

    time_started: Mapped[datetime]
    time_finished: Mapped[datetime]

    # Did usage fail?
    failed: Mapped[bool]

    cost: Mapped[float]

    resources_used: Mapped[list["ResourceUsageQuantity"]] = relationship(
        back_populates="machine_usage", cascade="all, delete"
    )

    # nullable field that notes who failed the usage, if it was failed
    failed_by_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id", name="fk_failed_by")
    )
    failed_by: Mapped[Optional["User"]] = relationship(foreign_keys=[failed_by_id])

    # nullable field that notes the fail reason, if it was failed
    failure_reason: Mapped[str | None]

    # time failed at, for hold period
    failed_at: Mapped[datetime | None]

    # nullable field that notes who cleared the usage, if it was cleared
    cleared_by_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id", name="fk_cleared_by")
    )
    cleared_by: Mapped[Optional["User"]] = relationship(foreign_keys=[cleared_by_id])
