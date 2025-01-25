from decimal import Decimal
from typing import TYPE_CHECKING
from .base import Base

from uuid import uuid4, UUID

from sqlalchemy import DECIMAL, UUID as DB_UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .resource_slot import ResourceSlot


class MachineTypeSlotAssociation(Base):
    __tablename__ = "machine_type_slot_associations"

    machine_type_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("machine_types.id"), primary_key=True
    )
    resource_slot_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("resource_slots.id"), primary_key=True
    )


class MachineType(Base):
    __tablename__ = "machine_types"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    name: Mapped[str] = mapped_column(unique=True)

    resource_slots: Mapped[list["ResourceSlot"]] = relationship(
        secondary="machine_type_slot_associations"
    )

    # How much to charge (in dollars per hour) when using this machine,
    # regardless of inputs.
    cost_per_hour: Mapped[Decimal] = mapped_column(DECIMAL(precision=10, scale=5), server_default="0")
