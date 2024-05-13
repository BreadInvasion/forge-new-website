from datetime import datetime, timedelta
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.models.auth import TokenPayload

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM = "HS256"


def create_access_token(RCSID: str, expires_delta: timedelta) -> str:
    expire = datetime.now() + expires_delta
    to_encode = TokenPayload(RCSID=RCSID, exp=expire).__dict__
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
