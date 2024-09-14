from typing import TYPE_CHECKING, Literal, Optional
from .base import Base

from sqlalchemy import UUID as DB_UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import UUID

from .semester import Semester


class State(Base):
    # Current state of the club. Handles active semester.
    __tablename__ = "state"

    # Primary key that forces there to be only one row in this table
    unique_id: Mapped[Literal["UNIQUE"]] = mapped_column(primary_key=True)

    # Current active semester.
    # If None, only staff with CAN_USE_MACHINES_BETWEEN_SEMESTERS will be able to log usages.
    active_semester: Mapped[Optional["Semester"]] = relationship()
    active_semester_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("semesters.id")
    )
