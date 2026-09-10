'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ActivityBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith('/adminplatform')) return;
    const send = () => {
      if (document.visibilityState !== 'visible') return;
      void fetch('/api/activity', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: pathname }), keepalive: true,
      }).catch(() => undefined);
    };
    send();
    const timer = window.setInterval(send, 30000);
    document.addEventListener('visibilitychange', send);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', send); };
  }, [pathname]);
  return null;
}
