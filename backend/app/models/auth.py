from datetime import datetime
from sqlmodel import SQLModel


class TokenResponse(SQLModel):
    """Response model for user auth JWT token."""

    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    """Payload model for user auth JWT token."""

    RCSID: str
    exp: datetime
