'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock3, Globe2, Monitor, Smartphone, Tablet } from 'lucide-react';

type Session = { id: string; email: string | null; masked_ip: string; browser: string; device: string; path: string; first_seen: number; last_seen: number };
export function AdminActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [snapshotAt, setSnapshotAt] = useState(0);
  const load = useCallback(async () => {
    const response = await fetch('/api/admin/activity', { cache: 'no-store' });
    if (response.ok) {
      const body = (await response.json()) as { sessions: Session[]; snapshotAt: number };
      setSessions(body.sessions);
      setSnapshotAt(body.snapshotAt);
    }
  }, []);
  useEffect(() => { const initial = window.setTimeout(() => void load(), 0); const timer = window.setInterval(() => void load(), 15000); return () => { window.clearTimeout(initial); window.clearInterval(timer); }; }, [load]);
  const active = sessions.filter((session) => snapshotAt - Number(session.last_seen) < 90000);
  const now = snapshotAt;
  return <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-heading text-2xl font-bold">Live website activity</h2><p className="mt-1 text-sm text-[#5d696c]">Browser sessions update about every 30 seconds. IP addresses are masked for privacy.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700"><span className="size-2 animate-pulse rounded-full bg-emerald-500" />{active.length} active now</span></div><div className="mt-6 overflow-hidden rounded-xl border bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#eef5f4]"><tr>{['Visitor','Status','Current page','Browser / device','Masked IP','Last seen'].map((label) => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody>{sessions.map((session) => { const isActive = now - Number(session.last_seen) < 90000; const DeviceIcon = session.device === 'Mobile' ? Smartphone : session.device === 'Tablet' ? Tablet : Monitor; return <tr key={session.id} className="border-t"><td className="px-4 py-4"><b>{session.email || 'Guest visitor'}</b><span className="mt-1 block font-mono text-[11px] text-[#718096]">{session.id.slice(0, 8)}</span></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{isActive ? 'Active' : 'Away'}</span></td><td className="px-4 py-4 font-medium">{session.path}</td><td className="px-4 py-4"><span className="flex items-center gap-2"><DeviceIcon size={16} />{session.browser} · {session.device}</span></td><td className="px-4 py-4"><span className="flex items-center gap-2"><Globe2 size={16} />{session.masked_ip}</span></td><td className="px-4 py-4"><span className="flex items-center gap-2"><Clock3 size={15} />{new Date(Number(session.last_seen)).toLocaleTimeString()}</span></td></tr>; })}{!sessions.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-[#687477]">No visitor activity recorded yet.</td></tr>}</tbody></table></div></div></section>;
}
