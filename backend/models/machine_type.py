from .base import Base

from uuid import uuid4, UUID

from sqlalchemy import UUID as DB_UUID
from sqlalchemy.orm import Mapped, mapped_column

class MachineType(Base):
    __tablename__ = "machine_types"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )