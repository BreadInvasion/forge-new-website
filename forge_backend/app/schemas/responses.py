from typing import List, Optional
from pydantic import BaseModel, ConfigDict, UUID4

from app.schemas.enums import MachineUsageStatus


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
    usage_status: Optional[MachineUsageStatus]

class MachineInfoGroup(BaseModel):
    group_name: str
    machines: List[MachineInfo]

class AllMachineInfoResponse(BaseResponse):
    groups: List[MachineInfoGroup]