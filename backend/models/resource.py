from decimal import Decimal
from .base import Base

from uuid import uuid4, UUID

from sqlalchemy import DECIMAL, String, UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column

class Resource(Base):
   # Represents a single usable resource, with its associated cost per unit of measure.
   __tablename__ = "resources"

   # Unique table identifier for the resource
   id: Mapped[UUID] = mapped_column(
      DB_UUID(as_uuid=True), primary_key=True, default=uuid4
   )

   # Brand name of the resource
   brand: Mapped[str]

   # Display name of the resource
   name: Mapped[str]

   # Unit of measure for the resource
   units: Mapped[str] = mapped_column(String(16))

   # Cost in dollars per <unit> of resource
   cost: Mapped[Decimal] = mapped_column(DECIMAL(scale=10, precision=5))