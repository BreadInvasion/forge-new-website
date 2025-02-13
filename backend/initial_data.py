"""
Put here any Python code that must be runned before application startup.
It is included in `init.sh` script.

By default `main` create a superuser if not exists
"""

import asyncio
import logging
from pydantic import SecretStr

from sqlalchemy import select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from core import security
from core.session import async_session
from models.role import Role
from models.user import User
from schemas.enums import GenderStatsType, PronounType, Permissions


async def main() -> None:
    print("Start initial data")
    async with async_session() as session:
        superuser_role = await session.scalar(
            select(Role).where(Role.name == "Super Admin")
        )

        if not superuser_role:
            superuser_role = Role(
                name="Super Admin",
                permissions=[Permissions.IS_SUPERUSER],
                inverse_permissions=[],
                display_role=False,
                priority=10000,
            )

            session.add(superuser_role)
            await session.commit()
            await session.refresh(superuser_role)

            print("Superuser role was created")
        else:
            print("Superuser role already exists in database")

        user = await session.scalar(select(User).where(User.RCSID == "haddlm"))

        if not user:

            new_superuser = User(
                RCSID="haddlm",
                RIN="662012578",
                first_name="Mark",
                last_name="Haddleton",
                major="Computer Science",
                gender_identity=GenderStatsType.MALE,
                pronouns=PronounType.HE_HIM,
                hashed_password=security.get_password_hash(SecretStr("12345")),
                roles=[superuser_role],
                is_rpi_staff=False,
                is_graduating=False,
            )

            session.add(new_superuser)
            await session.commit()
            print("Superuser was created")
        else:
            print("Superuser already exists in database")

        user = await session.scalar(select(User).where(User.RCSID == "byrnet2"))

        if not user:

            new_superuser = User(
                RCSID="byrnet2",
                RIN="662029936",
                first_name="Thomas",
                last_name="Byrne",
                major="Computer Science",
                gender_identity=GenderStatsType.MALE,
                pronouns=PronounType.HE_HIM,
                hashed_password=security.get_password_hash(SecretStr("password")),
                roles=[superuser_role],
                is_rpi_staff=False,
                is_graduating=False,
            )

            session.add(new_superuser)
            await session.commit()
            print("Thomas Superuser was created")
        else:
            print("Thomas Superuser already exists in database")

        print("Initial data created")


if __name__ == "__main__":
    asyncio.run(main())
