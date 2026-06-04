from uuid import UUID

import structlog
from redis.asyncio import Redis


class JobPublisher:
    def __init__(self, redis: Redis) -> None:
        self.redis = redis
        self.logger = structlog.get_logger(__name__)

    async def enqueue_report_generation(self, job_id: UUID) -> None:
        await self.redis.lpush("jobs:report_generation", str(job_id))
        self.logger.info("job_enqueued", job_id=str(job_id), queue="jobs:report_generation")

