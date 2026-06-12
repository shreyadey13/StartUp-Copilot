from collections.abc import AsyncGenerator

import structlog
from redis.asyncio import from_url

from app.core.config import get_settings

logger = structlog.get_logger(__name__)
settings = get_settings()

class MockRedis:
    def __init__(self):
        self._storage = {}
        logger.info("initialized_mock_redis")

    async def ping(self):
        return True

    async def lpush(self, key: str, value: str):
        if key not in self._storage:
            self._storage[key] = []
        self._storage[key].insert(0, value)
        logger.info("mock_redis_lpush", key=key, value=value)
        return len(self._storage[key])

    async def aclose(self):
        logger.info("mock_redis_closed")
        pass

class RedisClientProxy:
    def __init__(self):
        self._instance = from_url(settings.redis_url, decode_responses=True)
        self._is_mock = False

    def use_mock(self):
        logger.warning("redis_connection_failed_falling_back_to_mock")
        self._instance = MockRedis()
        self._is_mock = True

    async def ping(self):
        try:
            return await self._instance.ping()
        except Exception as e:
            if not self._is_mock:
                self.use_mock()
                return await self._instance.ping()
            raise e

    async def lpush(self, key: str, value: str):
        try:
            return await self._instance.lpush(key, value)
        except Exception as e:
            if not self._is_mock:
                self.use_mock()
                return await self._instance.lpush(key, value)
            raise e

    async def aclose(self):
        try:
            await self._instance.aclose()
        except Exception:
            pass

redis_client = RedisClientProxy()

async def get_redis() -> AsyncGenerator[RedisClientProxy, None]:
    yield redis_client


