from sqlmodel import Field, Relationship, SQLModel
from pydantic import UUID4, ValidationInfo, field_validator
from typing import TYPE_CHECKING
from uuid import uuid4

from app.enums import OrgRank
from app.models.machine_usage import MachineUsage

if TYPE_CHECKING:
    from app.models.user import User


class OrgPass(SQLModel, table=True):
    """Database models for org member access passes. SafeForUsers: NEVER"""

    org: "Org" = Relationship(back_populates="access_passes")
    org_id: UUID4 = Field(foreign_key="org.id", primary_key=True)
    user: "User" = Relationship(back_populates="access_passes")
    user_id: UUID4 = Field(foreign_key="user.id", primary_key=True)

    rank: OrgRank


class OrgBase(SQLModel):
    """Base data that should be included in all org-related requests. SafeForUsers: YES"""

    # Formal name of club, e.g. "RPI Robotics Club"
    full_name: str
    # Short abbreviation of full club name, one word no spaces e.g. "robotics"
    tag: str


class OrgPrivate(OrgBase):
    """Privileged data about orgs. SafeForUsers: PRIVILEGED"""

    # Soft delete. Prevents all org-related access, but does not actually remove org for charging purposes.
    deleted: bool = False

    # The RPI administrative organization to submit club billing to.
    managing_org: str
    # Financial account to charge all logged usages to
    fin_account_number: str = Field(max_length=20)

    @field_validator("fin_account_number")
    @classmethod
    def check_numeric(cls, v: str, info: ValidationInfo) -> str:
        if isinstance(v, str):
            # info.field_name is the name of the field being validated
            is_numeric = v.replace(" ", "").replace("-", "").isnumeric()
            assert (
                is_numeric
            ), f"{info.field_name} must only contain numbers, spaces, and hyphens"
        return v


class Org(OrgPrivate, table=True):
    """Database model for Org. SafeForUsers: NEVER"""

    # All access passes for org members. Access passes can have different levels of access.
    access_passes: list[OrgPass] = Relationship(back_populates="org")

    # Machine usage history for this org
    machine_usages: list["MachineUsage"] = Relationship(back_populates="org")

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)
