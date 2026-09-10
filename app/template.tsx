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
        <output className="page-transition-loader" aria-label="Loading page">
          <header className="page-skeleton-header">
            <Image src="/learvoro-logo-transparent.png" alt="Learvoro" width={2172} height={724} priority className="h-auto w-36" />
            <div className="page-skeleton-nav"><i /><i /><i /></div>
            <span className="page-skeleton-avatar" />
          </header>
          <div className="page-skeleton-progress"><i /></div>
          <main className="page-skeleton-shell">
            <section className="page-skeleton-main">
              <span className="skeleton-block skeleton-eyebrow" />
              <span className="skeleton-block skeleton-title" />
              <span className="skeleton-block skeleton-copy" />
              <span className="skeleton-block skeleton-copy" />
              <div className="page-skeleton-grid">
                <article><span /><b /><i /><i /></article>
                <article><span /><b /><i /><i /></article>
                <article><span /><b /><i /><i /></article>
              </div>
            </section>
            <aside className="page-skeleton-aside"><span /><b /><i /><i /><span className="page-skeleton-action" /></aside>
          </main>
        </output>
      )}
    </>
  );
}
