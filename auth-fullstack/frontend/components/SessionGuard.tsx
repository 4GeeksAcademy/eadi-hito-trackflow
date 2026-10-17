'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function SessionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (!/^\/(ops|inventory|incidents|suppliers|candidates|account)(\/|$)/.test(pathname)) return;
    let expiryTimer: ReturnType<typeof setTimeout>;
    let active = true;
    async function expire() {
      localStorage.removeItem('trackflow_access_token');
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
      window.location.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
    async function check() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        if (!active) return;
        if (response.status === 401) return expire();
        if (response.ok) {
          const { expiresAt } = await response.json() as { expiresAt: number };
          if (!active) return;
          clearTimeout(expiryTimer);
          expiryTimer = setTimeout(expire, Math.max(0, Math.min(expiresAt - Date.now(), 2147483647)));
        }
      } catch {
        return;
      }
    }
    function syncLogout(event: StorageEvent) {
      if (event.key === 'trackflow_access_token' && !event.newValue) expire();
    }
    void check();
    const interval = setInterval(() => void check(), 30000);
    window.addEventListener('focus', check);
    window.addEventListener('storage', syncLogout);
    return () => {
      active = false;
      clearTimeout(expiryTimer);
      clearInterval(interval);
      window.removeEventListener('focus', check);
      window.removeEventListener('storage', syncLogout);
    };
  }, [pathname]);

  return null;
}