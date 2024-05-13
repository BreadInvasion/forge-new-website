from typing import Optional, TYPE_CHECKING
from uuid import uuid4
from pydantic import UUID4
from sqlmodel import Field, Relationship, SQLModel

from app.enums import GenderType, PronounType

if TYPE_CHECKING:
    from app.models.org import OrgPass
    from app.models.machine_usage import MachineUsage
    from app.models.role import Role

MAX_RCSID_LENGTH = 11


class UserBase(SQLModel):
    """Base data for User. SafeForUsers: YES"""

    RCSID: str = Field(max_length=MAX_RCSID_LENGTH, index=True, unique=True)

    # Is this user RPI staff? RPI Staff users do not pay dues, but cannot use forge materials.
    is_rpi_staff: bool

    # Personal Info
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    pronouns: PronounType = PronounType.NOT_SHOWN


class UserPrivate(UserBase):
    """Private user info. SafeForUsers: PRIVILEGED"""

    RIN: int = Field(max_digits=9, index=True, unique=True)

    # Statistics
    gender_identity: GenderType = GenderType.NOTDISCLOSED
    major: Optional[str] = Field(max_length=40)

    # Allow ID Login
    allow_rfid: bool = False


class User(UserPrivate, table=True):
    """Database model for User. SafeForUsers: NEVER"""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str

    # Usage History
    machine_usages: list["MachineUsage"] = Relationship(back_populates="user")

    # Org Access
    access_passes: list["OrgPass"] = Relationship(back_populates="user")

    # Payment override. This user is staff alumni, do not charge them for membership or usage.
    do_not_charge: bool = False

    # Permission roles
    roles: list["Role"] = Relationship(sa_relationship_kwargs={"lazy": "selectin"})

    # Soft Delete. Prevents login, but does not prevent charging for current semester
    is_deleted: bool = False

    # Email validation. Treat users like they don't exist until validated.
    is_validated: bool = False
