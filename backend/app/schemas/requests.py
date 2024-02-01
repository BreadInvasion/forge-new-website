from typing import Annotated, List, Optional
from pydantic import UUID4, AfterValidator, BaseModel, EmailStr, SecretStr

from app.schemas.enums import GenderType, Permissions, PronounType, SemesterType


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


class UserCreateRequest(BaseRequest):
    # RPI Identification Information
    RCSID: str
    RIN: RIN

    # Name
    firstName: str
    lastName: str

    # Statistics Data
    major: str
    genderIdentity: GenderType

    # Pronouns
    pronouns: PronounType

    # Password
    password: SecretStr


class UserChangeNameRequest(BaseRequest):
    firstName: str
    lastName: str


class UserChangePronounsRequest(BaseRequest):
    pronouns: PronounType


class UserChangeDetailsRequest(BaseRequest):
    major: str
    genderIdentity: GenderType


class MachineGetTypeRequest(BaseRequest):
    machine_id: UUID4


class MachineUsageMaterial(BaseModel):
    slot_id: UUID4  # The slot being filled by this material choice
    material_id: UUID4  # The material chosen to fill the slot
    quantity: float  # The amount of the material being used (in whatever the chosen material's units are)
    is_own_material: bool  # The material being used belongs to the user


class MachineUseRequest(BaseRequest):
    machine_id: UUID4

    duration: int  # Duration in minutes

    materials: List[MachineUsageMaterial]

    is_for_class: bool
    is_reprint: bool


class MachineClearRequest(BaseRequest):
    machine_id: UUID4


class MachineFailRequest(BaseRequest):
    machine_id: UUID4
    reason: str


class MaterialCreateRequest(BaseRequest):
    name: str
    units: str
    cost: float


class MaterialGetRequest(BaseRequest):
    material_id: UUID4


class MaterialEditRequest(BaseRequest):
    material_id: UUID4
    name: str
    units: str
    cost: float


class MaterialDeleteRequest(BaseRequest):
    material_id: UUID4


class MaterialGroupCreateRequest(BaseRequest):
    name: str
    material_ids: List[UUID4]


class MaterialGroupEditRequest(BaseRequest):
    group_id: UUID4
    name: str
    material_ids: List[UUID4]


class MaterialGroupDeleteRequest(BaseRequest):
    group_id: UUID4


class MachineCreateRequest(BaseRequest):
    name: str
    type_id: UUID4


class MachineEditRequest(BaseRequest):
    machine_id: UUID4
    name: str
    type_id: UUID4


class MachineDeleteRequest(BaseRequest):
    machine_id: UUID4


class UserChangeRCSIDRequest(BaseRequest):
    target_RCSID: str
    new_RCSID: str


class UserChangeRINRequest(BaseRequest):
    target_RCSID: str
    new_RIN: RIN


class UserDeleteRequest(BaseRequest):
    target_RCSID: str


class GetChargeSheetsRequest(BaseRequest):
    semester_id: UUID4


class SemesterCreateRequest(BaseRequest):
    semester_type: SemesterType
    calendar_year: int


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
