from typing import TYPE_CHECKING
from .base import Base

from sqlalchemy import ARRAY, ForeignKey, String, UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import uuid4, UUID

from schemas.enums import Permissions

if TYPE_CHECKING:
    from .user import User


class UserRoleAssociation(Base):
    # Association table for the many-to-many relationship between User and Role.

    __tablename__ = "user_role_association"

    user_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    role_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True
    )


class Role(Base):
    # Represents a user role.

    __tablename__ = "roles"

    # Unique table identifier for the role
    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Display name of the role
    name: Mapped[str] = mapped_column(unique=True)

    permissions: Mapped[list[Permissions]] = mapped_column(ARRAY(String))
    inverse_permissions: Mapped[list[Permissions]] = mapped_column(ARRAY(String))

    # If this role is the highest priority role with display_role set, it will show as the user's primary role in the frontend
    display_role: Mapped[bool]

    # Filename of icon to use for this role
    role_icon_name: Mapped[str | None]

    # Priority determines whether a role overrides the permissions defined by another role that the
    # user possesses. Higher = override. Ties break alphabetically, but just... don't use the same number?
    priority: Mapped[int]

    users: Mapped[list["User"]] = relationship(
        secondary="user_role_association", back_populates="roles"
    )
