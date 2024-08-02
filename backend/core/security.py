"""Black-box security shortcuts to generate JWT tokens and password hashing and verifcation."""

import time

import jwt
from passlib.context import CryptContext
from pydantic import BaseModel, SecretStr

from . import config
from schemas.responses import AccessTokenResponse

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECS = config.settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
PWD_CONTEXT = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=config.settings.SECURITY_BCRYPT_ROUNDS,
)


class JWTTokenPayload(BaseModel):
    sub: str | int
    issued_at: int
    expires_at: int


def create_jwt_token(subject: str | int, exp_secs: int) -> tuple[str, int, int]:
    """Creates jwt access token for user.

    Args:
        subject: anything unique to user, id or email etc.
        exp_secs: expire time in seconds
    """

    issued_at = int(time.time())
    expires_at = issued_at + exp_secs

    to_encode: dict[str, int | str | bool] = {
        "issued_at": issued_at,
        "expires_at": expires_at,
        "sub": subject,
    }
    encoded_jwt = jwt.encode(
        to_encode,
        key=config.settings.SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )
    return encoded_jwt, expires_at, issued_at


def create_token_response(subject: str) -> AccessTokenResponse:
    token, expires_at, issued_at = create_jwt_token(
        subject=subject, exp_secs=ACCESS_TOKEN_EXPIRE_SECS
    )
    return AccessTokenResponse(
        token_type="bearer",
        access_token=token,
        expires_at=expires_at,
        issued_at=issued_at,
    )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain and hashed password matches

    Applies passlib context based on bcrypt algorithm on plain passoword.
    It takes about 0.3s for default 12 rounds of SECURITY_BCRYPT_DEFAULT_ROUNDS.
    """
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password: SecretStr) -> str:
    """Creates hash from password

    Applies passlib context based on bcrypt algorithm on plain passoword.
    It takes about 0.3s for default 12 rounds of SECURITY_BCRYPT_DEFAULT_ROUNDS.
    """
    return PWD_CONTEXT.hash(password.get_secret_value())
