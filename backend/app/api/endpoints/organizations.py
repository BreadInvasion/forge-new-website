from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security import get_password_hash
from app.models import (
    MachineType,
    MachineUsage,
    Material,
    MaterialGroup,
    MaterialUsageQuantity,
    User,
    Machine,
)
from app.schemas.responses import AllMachineInfoResponse, MachineInfo, MachineInfoGroup
from app.schemas.requests import (
    MaterialCreateRequest,
    MaterialEditRequest,
    MaterialDeleteRequest,
    MaterialGetRequest,
)
from app.schemas.enums import Permissions

router = APIRouter()
