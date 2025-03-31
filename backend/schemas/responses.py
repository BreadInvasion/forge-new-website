from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Any, Optional
from pydantic import BaseModel, ConfigDict, UUID4, Field

from .enums import GenderStatsType, LogType, PronounType, SemesterType


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AuditLogModel(BaseResponse):
    id: UUID4
    time_created: datetime
    type: LogType
    content: dict[str, Any]


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

    semester_balance: Decimal = Field(max_digits=10, decimal_places=2)


class MachineStatus(BaseResponse):
    id: UUID4
    name: str
    in_use: bool
    usage_start: Optional[datetime] = None
    usage_duration: Optional[int] = None
    maintenance_mode: bool
    disabled: bool
    failed: bool
    failed_at: Optional[datetime] = None
    user_name: Optional[str] = None


class MachineStatusGroup(BaseResponse):
    name: str
    machines: list[MachineStatus]


class AllMachinesStatusResponse(BaseResponse):
    groups: list[MachineStatusGroup]
    loners: list[MachineStatus]


class MachineInfoGroup(BaseModel):
    id: UUID4
    name: str
    num_machines: int
    machine_ids: list[UUID4]


class MachineInfoGroupDetails(MachineInfoGroup):
    audit_logs: list[AuditLogModel]


class ResourceInfo(BaseModel):
    id: UUID4
    name: str
    brand: Optional[str]
    color: Optional[str]
    units: str
    cost: Decimal = Field(max_digits=10, decimal_places=5)


class ResourceDetails(ResourceInfo):
    audit_logs: list[AuditLogModel]


class SemesterInfo(BaseModel):
    id: UUID4
    semester_type: SemesterType
    calendar_year: int = Field(ge=2020, le=9999)


class SemesterDetails(SemesterInfo):
    audit_logs: list[AuditLogModel]


class ResourceSlotInfo(BaseModel):
    id: UUID4
    db_name: str
    display_name: str
    valid_resource_ids: list[UUID4]
    allow_own_material: bool
    allow_empty: bool


class ResourceSlotDetails(ResourceSlotInfo):
    audit_logs: list[AuditLogModel]


class MachineTypeInfo(BaseModel):
    id: UUID4
    name: str
    num_machines: int
    resource_names: set[str]
    resource_slot_ids: list[UUID4]
    cost_per_hour: Decimal


class MachineTypeDetails(MachineTypeInfo):
    audit_logs: list[AuditLogModel]


class MachineCreateResponse(BaseResponse):
    machine_id: UUID4


class CreateResponse(BaseResponse):
    id: UUID4


class ResourceSlotSchema(BaseResponse):
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

class UsageResponse(BaseResponse):
    semester: str | None
    time_started: datetime
    duration: int
    machine_name: str
    cost: Decimal


class MachineInfo(BaseModel):
    id: UUID4
    name: str
    group_id: UUID4 | None
    group_name: str | None
    type_id: UUID4
    type_name: str
    maintenance_mode: bool
    disabled: bool
    active_usage_id: UUID4 | None


class MachineDetails(MachineInfo):
    audit_logs: list[AuditLogModel]
