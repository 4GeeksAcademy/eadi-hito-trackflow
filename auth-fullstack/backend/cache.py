from __future__ import annotations

from collections.abc import Callable, Hashable
from threading import RLock
from time import monotonic
from typing import TypeVar

T = TypeVar("T")
CacheKey = tuple[Hashable, ...]


class TTLCache:
    def __init__(self, ttl_seconds: float, clock: Callable[[], float] = monotonic) -> None:
        if ttl_seconds <= 0:
            raise ValueError("ttl_seconds debe ser mayor que cero.")
        self._ttl_seconds = ttl_seconds
        self._clock = clock
        self._entries: dict[CacheKey, tuple[float, object]] = {}
        self._lock = RLock()

    def get_or_set(self, key: CacheKey, loader: Callable[[], T]) -> T:
        now = self._clock()
        with self._lock:
            self._purge_expired(now)
            entry = self._entries.get(key)
            if entry is not None:
                expires_at, value = entry
                if expires_at > now:
                    return value  # type: ignore[return-value]

            value = loader()
            self._entries[key] = (self._clock() + self._ttl_seconds, value)
            return value

    def invalidate_prefix(self, prefix: CacheKey) -> None:
        with self._lock:
            for key in tuple(self._entries):
                if key[:len(prefix)] == prefix:
                    del self._entries[key]

    def _purge_expired(self, now: float) -> None:
        for key, (expires_at, _) in tuple(self._entries.items()):
            if expires_at <= now:
                del self._entries[key]


response_cache = TTLCache(ttl_seconds=30)