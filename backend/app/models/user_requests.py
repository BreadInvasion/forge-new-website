from typing import TYPE_CHECKING
from sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.models.user import UserBase, UserPrivate

# Request models are based on the core object models. Look at the parent(s) to get a full picture of what fields are in the request/response.


class UsersResponse(SQLModel):
    """Response format for bulk user request."""

    # Total number of users
    count: int

    # Users in page requested
    users: list[UserBase]


class CreateUserRequest(UserPrivate):
    """Request format for individual user creation."""

    password: str


class UpdateUserPasswordRequest(SQLModel):
    """Request format for password update in user preferences."""

    current_password: str
    new_password: str


class EmailPasswordResetRequest(SQLModel):
    """Request model for password reset by email. The initial GET request routes to frontend page,
    frontend retrieves access token from parameter and embeds it into a POST request."""

    access_token: str
    new_password: str
