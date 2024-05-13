from sqlmodel import Field, SQLModel

from pydantic import UUID4
from uuid import uuid4

from app.enums import Permission


class RoleBase(SQLModel):
    """Base data for a user role. SafeForUsers: YES"""

    # Name shown to users.
    display_name: str

    # Permissions granted with possession of this role.
    permissions: list[Permission]

    # Permissions *removed* with possession of this role. Only overrides roles of equal or lesser priority.
    inverse_permissions: list[Permission]

    # Priority determines which roles take precedence when setting permissions.
    priority: int

    # A user's highest priority role with display_role set will show as their role badge.
    display_role: bool


class RolePrivate(RoleBase):
    """Private data for a user role. SafeForUsers: PRIVILEGED"""

    # Name shown in admin panel.
    db_name: str = Field(unique=True)
    # Description shown in admin panel.
    db_description: str


class Role(RolePrivate, table=True):
    """Database model for user roles. SafeForUsers: NEVER"""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)
