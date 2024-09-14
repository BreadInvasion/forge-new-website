from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, UUID4, Field

from .enums import GenderStatsType, PronounType


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AccessTokenResponse(BaseResponse):
    token_type: str
    access_token: str
    expires_at: int
    issued_at: int


class BasicUserResponse(BaseResponse):
    RCSID: str
    first_name: str
    last_name: str


class UserNoHash(BaseModel):
    id: UUID4

    is_rpi_staff: bool

    RCSID: str
    RIN: str

    first_name: str
    last_name: str

    major: str | None

    gender_identity: GenderStatsType

    pronouns: PronounType

    role_ids: list[UUID4]

    is_graduating: bool


class MachineInfo(BaseModel):
    id: UUID4
    name: str

    is_in_use: bool
    is_failed: bool


class MachineInfoGroup(BaseModel):
    group_id: UUID4
    group_name: str
    machines: List[MachineInfo]

class ResourceInfo(BaseModel):
    id: UUID4
    name: str
    brand: Optional[str]
    units: str
    cost: Decimal = Field(max_digits=10, decimal_places=5)

class ResourceSlotInfo(BaseModel):
    id: UUID4
    db_name: str
    display_name: str
    valid_resources: list[ResourceInfo]
    allow_own_material: bool
    allow_empty: bool

class MachineTypeInfo(BaseModel):
    id: UUID4
    name: str
    resource_slots: list[ResourceSlotInfo]

class MachineCreateResponse(BaseResponse):
    machine_id: UUID4


class CreateResponse(BaseResponse):
    id: UUID4

class MachineUsageFailureLog(BaseModel):
    usage_id: UUID4
    machine_id: UUID4

    # Only one of these two pairs should be populated
    user_id: Optional[UUID4]
    user_name: Optional[str]
    organization_id: Optional[UUID4]
    organization_name: Optional[str]

    failed_at: datetime
    failed_by_id: UUID4
    failed_by_name: str
    failure_reason: str


class MachineUsageFailureLogsResponse(BaseResponse):
    logs: List[MachineUsageFailureLog]
