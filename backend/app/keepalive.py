"""Self-ping so the Render free web service doesn't fall asleep.

Render's free tier spins a service down after ~15 minutes without inbound
traffic, and the next visitor then waits 30-60 s on Render's "service waking
up" screen (this is what showed up when signing in with Google). While the
service is awake it pings its own public URL every few minutes; because the
request goes out through Render's public address it counts as inbound
traffic and resets the idle timer.

Configuration (all optional):
  KEEP_ALIVE=false          turn the self-ping off
  KEEP_ALIVE_SECONDS=600    gap between pings (must stay under 15 min)
  BACKEND_URL / RENDER_EXTERNAL_URL
                            the public URL to ping; Render sets both for us
                            (see render.yaml). With neither set (local dev)
                            nothing runs.
"""
import asyncio
import logging
import os
from contextlib import asynccontextmanager

import httpx

logger = logging.getLogger("keepalive")


async def _ping_forever(url: str, interval: float) -> None:
    async with httpx.AsyncClient(timeout=30) as client:
        while True:
            await asyncio.sleep(interval)
            try:
                resp = await client.get(url)
                logger.info("keep-alive ping %s -> %s", url, resp.status_code)
            except Exception as exc:  # never let a failed ping kill the loop
                logger.warning("keep-alive ping failed: %s", exc)


@asynccontextmanager
async def lifespan(app):
    base = (os.getenv("BACKEND_URL") or os.getenv("RENDER_EXTERNAL_URL") or "").rstrip("/")
    enabled = os.getenv("KEEP_ALIVE", "true").strip().lower() not in ("false", "0", "no")
    task = None
    if base and enabled:
        try:
            interval = float(os.getenv("KEEP_ALIVE_SECONDS", "600"))
        except ValueError:
            interval = 600.0
        task = asyncio.create_task(_ping_forever(f"{base}/api/health", interval))
        logger.info("keep-alive started: %s/api/health every %.0fs", base, interval)
    try:
        yield
    finally:
        if task:
            task.cancel()
