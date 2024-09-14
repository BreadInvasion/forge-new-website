from typing import TYPE_CHECKING
from sqlalchemy import String
from .base import Base

from sqlalchemy import UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import uuid4, UUID

from schemas.enums import GenderStatsType, PronounType

if TYPE_CHECKING:
    from .role import Role
    from .org import Org


class User(Base):
    __tablename__ = "users"

    # Unique table identifier for the user
    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Is RPI Faculty or Staff. Negates statistics fields.
    is_rpi_staff: Mapped[bool]

    # RPI identification details. Cannot be changed after account creation
    # except by administrator override.
    RCSID: Mapped[str] = mapped_column(String(32), unique=True)
    RIN: Mapped[str] = mapped_column(String(9), unique=True)

    # First and last name for display. User editable.
    first_name: Mapped[str] = mapped_column(String(64))
    last_name: Mapped[str] = mapped_column(String(64))

    # Major. Reported for statistics purposes only. User editable. Only None for RPI faculty/staff.
    major: Mapped[str | None] = mapped_column(String(64))

    # Gender Identity. Reported for statistics purposes only. User editable. Only None for RPI faculty/staff.
    gender_identity: Mapped[GenderStatsType] = mapped_column(
        default=GenderStatsType.NOTDISCLOSED
    )

    # Pronouns. Shown next to user's name for volunteer reference.
    pronouns: Mapped[PronounType]

    # Password hash (actual password not stored for security)
    hashed_password: Mapped[str] = mapped_column(String(128))

    # Roles assigned to the user, which grant (or remove) permissions
    roles: Mapped[list["Role"]] = relationship(
        secondary="user_role_association", back_populates="users"
    )

    # Is this user graduating in this semester? Determines which charge sheet they are added to.
    is_graduating: Mapped[bool]

    # Organizations that the user is a member of (can charge usages to the organization)
    orgs: Mapped[list["Org"]] = relationship(
        secondary="user_org_memberships", back_populates="members"
    )
