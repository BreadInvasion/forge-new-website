from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, UUID4, Field

from models.audit_log import AuditLog

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
    machine_usage_id: Optional[UUID4]

class MachineDetails(MachineInfo):
    audit_logs: list[AuditLog]

class MachineInfoGroup(BaseModel):
    id: UUID4
    name: str
    machine_ids: list[UUID4]

class MachineInfoGroupDetails(MachineInfoGroup):
    audit_logs: list[AuditLog]

class ResourceInfo(BaseModel):
    id: UUID4
    name: str
    brand: Optional[str]
    units: str
    cost: Decimal = Field(max_digits=10, decimal_places=5)

class ResourceDetails(ResourceInfo):
    audit_logs: list[AuditLog]

class ResourceSlotInfo(BaseModel):
    id: UUID4
    db_name: str
    display_name: str
    valid_resource_ids: list[UUID4]
    allow_own_material: bool
    allow_empty: bool

class ResourceSlotDetails(ResourceSlotInfo):
    audit_logs: list[AuditLog]

class MachineTypeInfo(BaseModel):
    id: UUID4
    name: str
    resource_slot_ids: list[UUID4]

class MachineTypeDetails(MachineTypeInfo):
    audit_logs: list[AuditLog]

class MachineCreateResponse(BaseResponse):
    machine_id: UUID4


class CreateResponse(BaseResponse):
    id: UUID4


class ResourceSlotSchema(BaseModel):
    resource_slot_id: UUID4
    display_name: str

    valid_resources: list[ResourceInfo]

    allow_own_material: bool
    allow_empty: bool

class MachineUsageSchema(BaseResponse):
    name: str
    group_id: UUID4 | None
    group_name: str | None
    type_id: UUID4
    type_name: str
    resource_slots: list[ResourceSlotSchema]

    maintenance_mode: bool