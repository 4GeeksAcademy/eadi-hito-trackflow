from cache import TTLCache


def test_ttl_cache_reuses_values_until_expiration() -> None:
    now = [0.0]
    calls = []
    cache = TTLCache(ttl_seconds=10, clock=lambda: now[0])
    loader = lambda: calls.append("load") or len(calls)

    assert cache.get_or_set(("summary",), loader) == 1
    assert cache.get_or_set(("summary",), loader) == 1
    now[0] = 10.0
    assert cache.get_or_set(("summary",), loader) == 2
    assert calls == ["load", "load"]


def test_cache_keys_and_prefix_invalidation_are_isolated() -> None:
    cache = TTLCache(ttl_seconds=30)
    cache.get_or_set(("suppliers", "list", 1), lambda: "user-1")
    cache.get_or_set(("suppliers", "list", 2), lambda: "user-2")
    cache.get_or_set(("incidents", "summary"), lambda: "summary")

    assert cache.get_or_set(("suppliers", "list", 1), lambda: "miss") == "user-1"
    assert cache.get_or_set(("suppliers", "list", 2), lambda: "miss") == "user-2"
    cache.invalidate_prefix(("suppliers",))
    assert cache.get_or_set(("suppliers", "list", 1), lambda: "miss") == "miss"
    assert cache.get_or_set(("incidents", "summary"), lambda: "miss") == "summary"