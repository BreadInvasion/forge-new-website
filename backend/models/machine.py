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

    group: Mapped[Optional["MachineGroup"]] = relationship()
    group_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("machine_groups.id"), nullable=True)

    active_usage_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("machine_usages.id"), nullable=True, unique=True)
    active_usage: Mapped[Optional["MachineUsage"]] = relationship(
        foreign_keys=[active_usage_id], uselist=False, post_update=True
    )



    # Prevent usage by members, show in machine list as in maintenance mode
    maintenance_mode: Mapped[bool] = mapped_column(default=False)

    # Prevent usage by members, hide from all non-internal machine lists
    disabled: Mapped[bool]         = mapped_column(default=False)
