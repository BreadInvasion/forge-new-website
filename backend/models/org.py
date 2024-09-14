from typing import TYPE_CHECKING
from .base import Base

from uuid import uuid4, UUID

from sqlalchemy import ForeignKey, String, UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from schemas.enums import OrgRole

if TYPE_CHECKING:
    from .user import User


class UserOrgMembership(Base):
    __tablename__ = "user_org_memberships"

    # The user's permission tier in the organization.
    org_role: Mapped[OrgRole]

    user_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    org_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), ForeignKey("organizations.id"), primary_key=True
    )


class Org(Base):
    __tablename__ = "organizations"

    # Unique table identifier for the organization
    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Proper name of org. Can include spaces.
    org_name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)

    members: Mapped[list["User"]] = relationship(
        secondary="user_org_memberships", back_populates="orgs"
    )
