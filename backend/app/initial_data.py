"""
Put here any Python code that must be runned before application startup.
It is included in `init.sh` script.

By default `main` create a superuser if not exists
"""

import asyncio
from pydantic import SecretStr

from sqlalchemy import select

from app.core import config, security
from app.core.session import async_session
from app.models import User
from app.schemas.enums import GenderType, PronounType


async def main() -> None:
    print("Start initial data")
    async with async_session() as session:
        user = await session.scalar(select(User).where(User.RCSID == "haddlm"))

        if not user:
            new_superuser = User(
                RCSID="haddlm",
                RIN="662012578",
                first_name="Mark",
                last_name="Haddleton",
                major="Computer Science",
                gender_identity=GenderType.MALE,
                pronouns=PronounType.HE_HIM,
                hashed_password=security.get_password_hash(SecretStr("12345")),
            )
            session.add(new_superuser)
            await session.commit()
            print("Superuser was created")
        else:
            print("Superuser already exists in database")

        print("Initial data created")


if __name__ == "__main__":
    asyncio.run(main())
