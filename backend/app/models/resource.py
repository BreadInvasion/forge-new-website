from datetime import datetime
from typing import Annotated
from sqlmodel import Field, SQLModel
from pydantic import UUID4
from uuid import uuid4


class ResourceBase(SQLModel):
    """Base data for resources. SafeForUsers: YES"""

    # Name of resource shown to members
    display_name: str

    # Manufacturer of resource
    manufacturer: str = "Unknown"

    # Unit of measurement for resource usage
    units: str
    # Cost in dollars per unit of resource used
    cost_per_unit: float

    # Is resource available for use by members?
    public_use: bool

    # Unit of measurement for resource inventory tracking
    inventory_units: str
    # Number of inventory_units in forge inventory as of inventory_updated
    units_in_forge_inventory: int
    # The last time units_in_forge_inventory was updated
    inventory_updated: datetime = Field(default_factory=datetime.now, nullable=False)


class ResourcePrivate(ResourceBase):
    """Privileged information about resources. SafeForUsers: PRIVILEGED"""

    db_name: Annotated[str, "name of resource in admin panel"] = Field(unique=True)
    db_description: Annotated[str, "description of resource in admin panel"]


class Resource(ResourcePrivate, table=True):
    """Database model for resources."""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)
