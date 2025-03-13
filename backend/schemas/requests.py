from decimal import Decimal
from typing import Annotated, List, Optional
from pydantic import UUID4, AfterValidator, BaseModel, EmailStr, Field, SecretStr, BeforeValidator

from .enums import GenderStatsType, Permissions, PronounType, SemesterType


def check_RIN(RIN: str) -> str:
    assert RIN.isnumeric()
    assert len(RIN) == 9
    return RIN

RIN = Annotated[str, AfterValidator(check_RIN)]

class BaseRequest(BaseModel):
    # may define additional fields or config shared across requests
    pass


class UserUpdatePasswordRequest(BaseRequest):
    password: SecretStr


class ResourceUsage(BaseModel):
    resource_id: UUID4
    amount: Decimal
    is_own_material: bool


class MachineUsageRequest(BaseRequest):

    # Map resource slot id to resource usage quantity details
    resource_usages: dict[UUID4, ResourceUsage]
    duration_seconds: int

    as_org_id: Optional[UUID4]   


class UserCreateRequest(BaseRequest):
    # RPI Identification Information
    RCSID: str
    RIN: RIN

    # Name
    first_name: str
    last_name: str

    # Statistics Data
    major: str
    gender_identity: GenderStatsType

    # Pronouns
    pronouns: PronounType

    # Password
    password: SecretStr


class UserChangeNameRequest(BaseRequest):
    first_name: str
    last_name: str


class UserChangePronounsRequest(BaseRequest):
    pronouns: PronounType


class UserChangeDetailsRequest(BaseRequest):
    major: str
    gender_identity: GenderStatsType


class MachineGetTypeRequest(BaseRequest):
    machine_id: UUID4


class MachineUsageResource(BaseModel):
    slot_id: UUID4  # The slot being filled by this resource choice
    resource_id: UUID4  # The resource chosen to fill the slot
    quantity: Decimal  # The amount of the resource being used (in whatever the chosen resource's units are)
    is_own_resource: bool  # The resource being used belongs to the user


class MachineUseRequest(BaseRequest):
    machine_id: UUID4

    duration: int  # Duration in minutes

    resources: List[MachineUsageResource]

    is_for_class: bool
    is_reprint: bool


class MachineClearRequest(BaseRequest):
    machine_id: UUID4


class MachineFailRequest(BaseRequest):
    machine_id: UUID4
    reason: str


class ResourceCreateRequest(BaseRequest):
    name: str
    brand: Optional[str]
    color: Optional[str]
    units: str
    cost: Decimal = Field(max_digits=10, decimal_places=5)


class ResourceGetRequest(BaseRequest):
    resource_id: UUID4


class ResourceEditRequest(BaseRequest):
    name: str
    brand: Optional[str]
    color: Optional[str]
    units: str
    cost: Decimal = Field(max_digits=10, decimal_places=5)


class ResourceDeleteRequest(BaseRequest):
    resource_id: UUID4


class ResourceSlotCreateRequest(BaseRequest):
    db_name: str
    display_name: str
    resource_ids: List[UUID4]
    allow_own_material: bool
    allow_empty: bool


class ResourceSlotGetRequest(BaseRequest):
    resource_slot_id: UUID4


class ResourceSlotEditRequest(BaseRequest):
    db_name: str
    display_name: str
    resource_ids: List[UUID4]
    allow_own_material: bool
    allow_empty: bool


class ResourceSlotDeleteRequest(BaseRequest):
    resource_slot_id: UUID4


class MachineTypeEditRequest(BaseRequest):
    name: str
    resource_slot_ids: list[UUID4]
    cost_per_hour: Decimal = Field(max_digits=10, decimal_places=5)


class MachineCreateRequest(BaseRequest):
    name: str
    group_id: Optional[UUID4]
    type_id: UUID4


class MachineEditRequest(BaseRequest):
    name: str
    type_id: UUID4
    group_id: Optional[UUID4]
    maintenance_mode: bool
    disabled: bool


class MachineDeleteRequest(BaseRequest):
    machine_id: UUID4


class UserChangeRCSIDRequest(BaseRequest):
    target_RCSID: str
    new_RCSID: str


class MachineGroupCreateRequest(BaseRequest):
    name: str


class MachineGroupEditRequest(BaseRequest):
    name: str
    machine_ids: list[UUID4]


class MachineTypeCreateRequest(BaseRequest):
    name: str
    resource_slot_ids: list[UUID4]
    cost_per_hour: Decimal = Field(max_digits=10, decimal_places=5)


class UserChangeRINRequest(BaseRequest):
    target_RCSID: str
    new_RIN: RIN


class UserDeleteRequest(BaseRequest):
    target_RCSID: str


class GetChargeSheetsRequest(BaseRequest):
    semester_id: UUID4


class SemesterCreateRequest(BaseRequest):
    semester_type: SemesterType
    calendar_year: int = Field(ge=2020, le=9999)


class SemesterEditRequest(BaseRequest):
    semester_type: SemesterType
    calendar_year: int = Field(ge=2020, le=9999)


class ActivateSemesterRequest(BaseRequest):
    semester_id: UUID4


class RoleCreateRequest(BaseRequest):
    name: str

    permissions: List[Permissions]
    inverse_permissions: List[Permissions]

    display_role: bool

    priority: int


class RoleGetRequest(BaseRequest):
    role_id: UUID4


class RoleEditRequest(BaseRequest):
    role_id: UUID4

    name: str

    permissions: List[Permissions]
    inverse_permissions: List[Permissions]

    display_role: bool

    priority: int


class RoleDeleteRequest(BaseRequest):
    role_id: UUID4


class UserAddRoleRequest(BaseRequest):
    user_id: UUID4
    role_id: UUID4


class OrgCreateRequest(BaseRequest):
    username: str
    name: str
    email: EmailStr
