import logging

from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import engine, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init() -> None:
    with AsyncSession(engine) as session:
        await init_db(session)


async def main() -> None:
    logger.info("Creating initial data")
    await init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
