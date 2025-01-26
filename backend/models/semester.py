from .base import Base

from sqlalchemy import UUID as DB_UUID, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import uuid4, UUID

from schemas.enums import SemesterType


class Semester(Base):
    __tablename__ = "semesters"
    __table_args__ = (UniqueConstraint("semester_type", "calendar_year"),)

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    semester_type: Mapped[SemesterType]
    calendar_year: Mapped[int]
