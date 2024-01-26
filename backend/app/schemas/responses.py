from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, UUID4


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AccessTokenResponse(BaseResponse):
    token_type: str
    access_token: str
    expires_at: int
    issued_at: int


class UserResponse(BaseResponse):
    RCSID: str
    firstName: str
    lastName: str


class MachineInfo(BaseModel):
    id: UUID4
    name: str

    is_in_use: bool
    is_failed: bool


class MachineInfoGroup(BaseModel):
    group_name: str
    machines: List[MachineInfo]


class AllMachineInfoResponse(BaseResponse):
    groups: List[MachineInfoGroup]


class MachineCreateResponse(BaseResponse):
    machine_id: UUID4


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
