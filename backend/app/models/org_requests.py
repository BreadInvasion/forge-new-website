from pydantic import UUID4
from sqlmodel import Field, SQLModel

from app.models.user import MAX_RCSID_LENGTH
from app.enums import OrgRank
from app.models.org import OrgBase


class AddOrgPassRequest(SQLModel):
    """Request model for adding a new org access pass to an org."""

    org_id: UUID4
    user_RCSID: str = Field(max_length=MAX_RCSID_LENGTH)
    rank: OrgRank


class RemoveOrgPassRequest(SQLModel):
    """Request model for removing an org access pass from an org."""

    org_id: UUID4
    user_RCSID: str = Field(max_length=MAX_RCSID_LENGTH)


class SetOrgPassRankRequest(SQLModel):
    """Request model for changing the rank of an org access pass."""

    org_id: UUID4
    user_RCSID: str = Field(max_length=MAX_RCSID_LENGTH)
    new_rank: OrgRank


class CreateOrgRequest(OrgBase):
    """Request model for creating a new org. Site Admin only."""

    admin_RCSID: str = Field(max_length=MAX_RCSID_LENGTH)


class UpdateOrgRequest(OrgBase):
    """Request model for updating an org's identifying information. Use OrgPass requests for permission changes."""

    org_id: UUID4


class DeleteOrgRequest(SQLModel):
    """Request model for soft deleting an org. This will not remove owed charges for the semester."""

    org_id: UUID4
