'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role */

import { useState } from 'react';
import type { Course } from '@/lib/course-data';

type AdminCourse = Course & { platformEnrollments: number; externalEnrollments: number };

export function AdminCoursePrices({ initialCourses }: { initialCourses: AdminCourse[] }) {
  const [items, setItems] = useState(initialCourses);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function save(course: AdminCourse) {
    setSaving(course.id);
    setMessage('');
    const response = await fetch('/api/admin/courses', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ courseId: course.id, price: course.price, externalEnrollments: course.externalEnrollments }),
    });
    setSaving(null);
    setMessage(response.ok ? `${course.title} settings updated.` : 'Could not update the course settings.');
  }

  return (
    <section className="mt-10 rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="font-heading text-2xl font-bold">Course settings</h2><p className="mt-1 text-sm text-[#5d696c]">Update pricing and record verified enrollments completed outside Learvoro.</p></div>
        {message && <p role="status" className="text-sm font-semibold text-[#087861]">{message}</p>}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((course) => (
          <article key={course.id} className="rounded-lg border p-4">
            <h3 className="min-h-12 font-semibold leading-6">{course.title}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold uppercase tracking-wide text-[#657794]" htmlFor={`price-${course.id}`}>Price (USD)</label><div className="mt-1 flex items-center rounded-lg border bg-white px-3"><span className="text-[#657794]">$</span><input id={`price-${course.id}`} type="number" min="0.50" step="0.01" value={(course.price / 100).toFixed(2)} onChange={(event) => setItems((current) => current.map((item) => item.id === course.id ? { ...item, price: Math.max(0, Math.round(Number(event.target.value) * 100)) } : item))} className="h-11 min-w-0 flex-1 px-2 outline-none" /></div></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wide text-[#657794]" htmlFor={`enrollments-${course.id}`}>External enrolled</label><input id={`enrollments-${course.id}`} type="number" min="0" step="1" value={course.externalEnrollments} onChange={(event) => setItems((current) => current.map((item) => item.id === course.id ? { ...item, externalEnrollments: Math.max(0, Math.round(Number(event.target.value))) } : item))} className="mt-1 h-11 w-full rounded-lg border px-3 outline-none" /></div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm"><span className="text-[#5d696c]">Platform: {course.platformEnrollments.toLocaleString()} · Total: {(course.platformEnrollments + course.externalEnrollments).toLocaleString()}</span><button type="button" disabled={saving === course.id || course.price < 50} onClick={() => void save(course)} className="rounded-lg bg-[#0757B2] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving === course.id ? 'Saving...' : 'Save'}</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}
