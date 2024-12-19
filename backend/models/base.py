from typing import Any
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.dialects.postgresql import JSONB

class Base(DeclarativeBase):
    type_annotation_map = {
        dict[str, Any]: JSONB
    }
