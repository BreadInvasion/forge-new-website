from sqlmodel import Field, Relationship, SQLModel
from pydantic import UUID4

from uuid import uuid4
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.resource_slot import ResourceSlot
    from app.models.user import User


class MachineTypeBase(SQLModel):
    """Base type information for different categories of machines. SafeForUsers: YES"""

    # Name as shown to users (e.g. "Prusa i3 Mk3")
    display_name: str

    # Inputs which the user MUST select.
    required_inputs: list["ResourceSlot"]
    # Inputs which the user MAY select.
    optional_inputs: list["ResourceSlot"]

    # Cost in dollars per minute of machine usage. Default $0.
    cost_per_minute: float

    # Should machines of this type clear their active usage as soon as it's logged?
    clear_on_log: bool
    # Should machines of this type clear their active usage as soon as its duration has elapsed, if it hasn't been marked as failed?
    clear_on_complete: bool


class MachineTypePrivate(MachineTypeBase):
    # Name as shown in admin panel
    db_name: str = Field(unique=True)
    # Description in db panel
    db_description: str = ""


class MachineType(MachineTypePrivate, table=True):
    """Database model for different categories of machines."""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)

    # Users who are explicitly restricted from using machines of this type.
    banned_users: list["User"]
