from typing import TYPE_CHECKING, Optional
from .base import Base

from uuid import uuid4, UUID

from sqlalchemy import ForeignKey, UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .machine_type import MachineType
    from .machine_usage import MachineUsage
    from .machine_group import MachineGroup


class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    name: Mapped[str] = mapped_column(unique=True)

    type: Mapped["MachineType"] = relationship()
    type_id: Mapped[UUID] = mapped_column(ForeignKey("machine_types.id"))

    group: Mapped["MachineGroup"] = relationship()
    group_id: Mapped[UUID] = mapped_column(ForeignKey("machine_groups.id"))

    active_usage: Mapped[Optional["MachineUsage"]] = relationship(
        back_populates="machine"
    )
