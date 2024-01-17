from typing import List
from pydantic import UUID4, BaseModel, EmailStr, SecretStr

from app.schemas.enums import GenderType, PronounType


class BaseRequest(BaseModel):
    # may define additional fields or config shared across requests
    pass


class UserUpdatePasswordRequest(BaseRequest):
    password: SecretStr


class UserCreateRequest(BaseRequest):
    # RPI Identification Information
    RCSID: str
    RIN: str

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


class MachineUsageMaterial(BaseModel):
    slot_id: UUID4  # The slot being filled by this material choice
    material_id: UUID4  # The material chosen to fill the slot
    quantity: float  # The amount of the material being used (in whatever the chosen material's units are)
    is_own_material: bool  # The material being used belongs to the user


class MachineUsageRequest(BaseRequest):
    machine_id: UUID4

    duration: int  # Duration in minutes

    materials: List[MachineUsageMaterial]

    is_for_class: bool
    is_reprint: bool


class ClearMachineRequest(BaseRequest):
    machine_id: UUID4


class FailMachineRequest(BaseRequest):
    machine_id: UUID4
    reason: str
