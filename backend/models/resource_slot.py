from .base import Base

from typing import TYPE_CHECKING
from uuid import uuid4, UUID

from sqlalchemy import UUID as DB_UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .resource import Resource

class ResourceSlotAssociation(Base):
    __tablename__ = "resource_slot_associations"

    resource_slot_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("resource_slots.id"), primary_key=True)
    resource_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("resources.id"), primary_key=True)

class ResourceSlot(Base):
    """A set of valid materials for an input slot on a machine."""
    __tablename__ = "resource_slots"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Internal reference name for the slot.
    db_name: Mapped[str] = mapped_column(unique=True)

    # Display name for the slot.
    display_name: Mapped[str]

    # Valid inputs for the slot.
    valid_resources: Mapped[list["Resource"]] = relationship(secondary="resource_slot_associations")

    # Should users be allowed to use their own material for this slot?
    allow_own_material: Mapped[bool]

    # Can this slot be left empty?
    allow_empty: Mapped[bool]