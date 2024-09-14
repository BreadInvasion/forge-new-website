from .base import Base

from sqlalchemy import UUID as DB_UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING
from uuid import uuid4, UUID

from schemas.enums import SemesterType

if TYPE_CHECKING:
    from .user import User
    from .org import Org


class UserSemesterAssociation(Base):
    __tablename__ = "user_semester_associations"

    user_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    semester_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("semesters.id"), primary_key=True
    )


class OrgSemesterAssociation(Base):
    __tablename__ = "org_semester_associations"

    org_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("organizations.id"), primary_key=True
    )
    semester_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("semesters.id"), primary_key=True
    )


class Semester(Base):
    __tablename__ = "semesters"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    semester_type: Mapped[SemesterType]
    calendar_year: Mapped[int]

    # Users with a paid membership in this semester
    active_members: Mapped[list["User"]] = relationship(
        secondary="user_semester_associations"
    )

    # Orgs who have paid to be active this semester
    active_orgs: Mapped[list["Org"]] = relationship(
        secondary="org_semester_associations"
    )
