from sqlalchemy import DateTime, ForeignKey, func
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
    machine: Mapped["Machine"] = relationship()

    semester_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("semesters.id"))
    semester: Mapped[Optional["Semester"]] = relationship()

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", name="fk_used_by"))
    user: Mapped["User"] = relationship(foreign_keys=[user_id])

    time_started: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    duration_seconds: Mapped[int]

    # Did usage fail?
    failed: Mapped[bool] = mapped_column(default=False)
    failed_at: Mapped[Optional[datetime]]

    cost: Mapped[float]

    resources_used: Mapped[list["ResourceUsageQuantity"]] = relationship(
        back_populates="machine_usage", cascade="all, delete"
    )
