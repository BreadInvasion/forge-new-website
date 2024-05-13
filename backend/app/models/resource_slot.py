from sqlmodel import Field, Relationship, SQLModel
from pydantic import UUID4
from uuid import uuid4

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.resource import Resource


class ResourceSlotBase(SQLModel):
    """Base data for a resource slot. Resource slots define valid inputs for machine types. SafeForUsers: YES"""

    # Slot name shown to members. E.G. "Filament"
    display_name: str

    # Allow "Other" input?
    allow_other: bool = False
    # Require manual volunteer approval for "Other" inputs?
    other_requires_manual_approval: bool = True

    # Allow the user to use their own material instead of forge material?
    allow_own_material: bool


class ResourceSlotPrivate(ResourceSlotBase):
    """Privileged data for resource slots. SafeForUsers: PRIVILEGED"""

    # Slot name shown in admin panel.
    db_name: str = Field(unique=True)
    # Description of slot shown in admin panel.
    db_description: str


class ResourceSlot(ResourceSlotPrivate, table=True):
    """Database model for resource slots."""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)

    # A list of all valid resources for this slot
    valid_resources: list["Resource"] = Relationship()
