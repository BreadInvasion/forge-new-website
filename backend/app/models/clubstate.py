from sqlmodel import Field, Relationship, SQLModel

from typing import TYPE_CHECKING

from app.enums import Unique

from pydantic import UUID4

if TYPE_CHECKING:
    from app.models.semester import Semester


class ClubStateBase(SQLModel):
    """Base data for current state of club management data. SafeForUsers: PRIVILEGED"""

    active_semester_id: UUID4 | None = Field(foreign_key="semester.id")


class ClubState(ClubStateBase, table=True):
    """Database model for current state of club management data.
    Table should only ever have one row, representing the current configuration. SafeForUsers: NEVER
    """

    # ID is always 1, and is primary key, so it is (intentionally) impossible to create multiple ClubState objects!
    id: Unique = Field(default=Unique.ONE, primary_key=True)

    # Current semester. There must be an active semester in order for non-staff to log usages.
    active_semester: "Semester" | None = Relationship()

    # Is the space open to members? (Controls usage logging)
    is_open: bool = True
