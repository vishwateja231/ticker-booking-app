import redis.asyncio as redis
from app.core.config import settings

import os

# Use settings.REDIS_URL which now comes efficiently from env
# ssl_cert_reqs=None is added to avoid SSL errors on some local environments with Upstash
pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL, 
    decode_responses=True,
    ssl_cert_reqs=None 
)

def get_redis_client():
    return redis.Redis(connection_pool=pool)
