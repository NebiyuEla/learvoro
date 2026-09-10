'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 420);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={ready ? 'page-transition-content is-ready' : 'page-transition-content'}>{children}</div>
      {!ready && (
        <div className="page-transition-loader" role="status" aria-label="Loading page">
          <Image src="/learvoro-logo-transparent.png" alt="Learvoro" width={2172} height={724} priority className="h-auto w-40" />
          <span className="page-transition-line"><i /></span>
        </div>
      )}
    </>
  );
}
