import asyncio
import logging

from sqlalchemy import select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from core.session import async_session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 300
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def wait_for_db() -> None:
    async with async_session() as session:
        try:
            await session.execute(select(1))
        except Exception as e:
            logger.error(e)
            raise e


if __name__ == "__main__":
    print("Waiting for db...")
    asyncio.run(wait_for_db())
    print("Finished waiting for db.")
