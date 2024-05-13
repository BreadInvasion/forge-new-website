from sqlmodel import Field, Relationship, SQLModel

from typing import TYPE_CHECKING

from pydantic import UUID4
from uuid import uuid4

from app.enums import SemesterSeason

if TYPE_CHECKING:
    from app.models.machine_usage import MachineUsage
    from app.models.user import User


class SemesterBase(SQLModel):
    """Base data for semesters. SafeForUsers: PRIVILEGED"""

    season: SemesterSeason
    year: int

    # All machine usages during the semester
    machine_usages: list["MachineUsage"]

    # All users who paid Member dues for this semester
    members: list["User"]


class Semester(SemesterBase):
    """Database model for semesters. SafeForUsers: NEVER"""

    id: UUID4 = Field(default_factory=uuid4, primary_key=True)
