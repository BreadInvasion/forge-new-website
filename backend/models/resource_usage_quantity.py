from decimal import Decimal
from .base import Base

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import DECIMAL, ForeignKey, UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .machine_usage import MachineUsage
    from .resource import Resource
    from .resource_slot import ResourceSlot


class ResourceUsageQuantity(Base):
    """How much of a resource was used, and its cost at the time, during a specific machine usage."""

    __tablename__ = "resource_usage_quantities"

    machine_usage_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("machine_usages.id"), primary_key=True
    )
    machine_usage: Mapped["MachineUsage"] = relationship(
        foreign_keys=[machine_usage_id], uselist=False
    )

    resource_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("resources.id")
    )
    resource: Mapped["Resource"] = relationship()

    is_own_material: Mapped[bool]

    amount: Mapped[Decimal] = mapped_column(DECIMAL(precision=15, scale=5))
    # Cost per unit at time of usage
    cpu_at_usage: Mapped[Decimal] = mapped_column(DECIMAL(precision=10, scale=5))
