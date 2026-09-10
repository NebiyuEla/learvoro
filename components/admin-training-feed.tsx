'use client';
import { useEffect, useState } from 'react';
import { Activity, Clock3, MonitorCheck, RefreshCw } from 'lucide-react';
import type { TrainingCapture } from '@/lib/training-capture';

export function AdminTrainingFeed() {
  const [records, setRecords] = useState<TrainingCapture[]>([]);
  const [online, setOnline] = useState(false);
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const response = await fetch('/api/training/capture', {
          cache: 'no-store',
        });
        const body = (await response.json()) as { records?: TrainingCapture[] };
        if (active && response.ok) {
          setRecords(body.records ?? []);
          setOnline(true);
        }
      } catch {
        if (active) setOnline(false);
      }
    }
    void refresh();
    const timer = setInterval(() => void refresh(), 1200);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0b8f70]">
            <Activity size={17} />
            <span
              className={`size-2 rounded-full ${online ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`}
            />
            {online ? 'Live monitor connected' : 'Connecting monitor'}
          </div>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            Checkout training activity
          </h2>
          <p className="mt-1 text-sm text-[#657794]">
            Ephemeral synthetic submissions from the classroom checkout. Nothing
            is written to the database.
          </p>
        </div>
        <span className="rounded-full bg-[#e8f3ff] px-3 py-1.5 text-sm font-semibold text-[#0757B2]">
          {records.length} session {records.length === 1 ? 'record' : 'records'}
        </span>
      </div>
      {records.length ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {records.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#e7f8f3] text-[#0b8f70]">
                    <MonitorCheck size={21} />
                  </span>
                  <div>
                    <b className="block">{record.fullName}</b>
                    <span className="text-sm text-[#657794]">
                      {record.email}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-[#657794]">
                  <Clock3 size={13} />
                  {new Date(record.receivedAt).toLocaleTimeString()}
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ['Phone', record.phone],
                  ['Location', `${record.city}, ${record.region}`],
                  ['Address', `${record.address}, ${record.postalCode}`],
                  ['Training number', record.trainingNumber],
                  ['Expiry', record.expiry],
                  ['Demo code', record.demoCode],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-[#f6f8fa] p-3">
                    <dt className="text-xs uppercase tracking-wide text-[#657794]">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t pt-4 text-xs text-[#657794]">
                {record.product}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid min-h-48 place-items-center rounded-2xl border border-dashed bg-white text-center">
          <div>
            <RefreshCw className="mx-auto text-[#8aa0b8]" />
            <b className="mt-3 block">Waiting for a training submission</b>
            <p className="mt-1 text-sm text-[#657794]">
              Open the checkout demonstration in another tab and submit the
              displayed synthetic values.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
