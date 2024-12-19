from datetime import datetime
from typing import Any
from .base import Base

from schemas.enums import LogType

from sqlalchemy import UUID as DB_UUID, DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from uuid import uuid4, UUID

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    time_created: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    type: Mapped[LogType] = mapped_column(Enum(LogType))

    # Maps to JSONB
    content: Mapped[dict[str, Any]]