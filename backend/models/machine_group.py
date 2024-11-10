from typing import TYPE_CHECKING
from .base import Base

from uuid import uuid4, UUID

from sqlalchemy import UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .machine import Machine


class MachineGroup(Base):
    __tablename__ = "machine_groups"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    name: Mapped[str] = mapped_column(unique=True)

    machines: Mapped[list["Machine"]] = relationship(back_populates="group")
