from .base import Base

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .machine_usage import MachineUsage
    from .resource import Resource
    from .resource_slot import ResourceSlot


class ResourceUsageQuantity(Base):
    """How much of a resource was used in a specific resource slot during a specific machine usage."""

    __tablename__ = "resource_usage_quantities"

    machine_usage_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("machine_usages.id"), primary_key=True
    )
    machine_usage: Mapped["MachineUsage"] = relationship(
        back_populates="resources_used"
    )

    resource_slot_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("resource_slots.id"), primary_key=True
    )
    resource_slot: Mapped["ResourceSlot"] = relationship()

    resource_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("resources.id")
    )
    resource: Mapped["Resource"] = relationship()

    is_own_material: Mapped[bool]
