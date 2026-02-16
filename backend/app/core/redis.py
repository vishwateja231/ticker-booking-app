import redis.asyncio as redis
from app.core.config import settings

import os

# Use settings.REDIS_URL which now comes efficiently from env
pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis_client():
    return redis.Redis(connection_pool=pool)
