import { isAdmin } from '@/lib/admin-auth';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { findCourse } from '@/lib/course-data';
import {
  addTrainingCapture,
  trainingCaptures,
  type TrainingCapture,
} from '@/lib/training-capture';

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'INVALID_TRAINING_DATA' }, { status: 400 });
  }
  const values = {
    fullName: clean(body.fullName, 80),
    email: clean(body.email, 120),
    phone: clean(body.phone, 30),
    country: clean(body.country, 40),
    region: clean(body.region, 60),
    city: clean(body.city, 60),
    address: clean(body.address, 120),
    postalCode: clean(body.postalCode, 20),
    trainingNumber: clean(body.trainingNumber, 19),
    expiry: clean(body.expiry, 5),
    demoCode: clean(body.demoCode, 3),
  };
  const synthetic =
    /^Student \d{4}$/.test(values.fullName) &&
    /^student\d{4}@example\.edu$/.test(values.email) &&
    /^\+1 555 010 \d{4}$/.test(values.phone) &&
    values.country.length > 0 &&
    values.region.length > 0 &&
    values.city.length > 0 &&
    /^\d{3} Training Avenue$/.test(values.address) &&
    /^9\d{4}$/.test(values.postalCode) &&
    /^0000 \d{4} \d{4} \d{4}$/.test(values.trainingNumber) &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry) &&
    /^\d{3}$/.test(values.demoCode);
  if (!synthetic)
    return Response.json({ error: 'SYNTHETIC_VALUES_ONLY' }, { status: 400 });
  const course = findCourse(clean(body.courseSlug, 100));
  if (!course)
    return Response.json({ error: 'COURSE_NOT_FOUND' }, { status: 404 });
  const requestedId = clean(body.captureId, 80);
  const capture: TrainingCapture = {
    id: requestedId || crypto.randomUUID(),
    userId: user.userId,
    courseId: course.id,
    courseSlug: course.slug,
    receivedAt: Date.now(),
    status: 'pending',
    product: course.title,
    ...values,
  };
  addTrainingCapture(capture);
  return Response.json({ accepted: true, id: capture.id, status: capture.status });
}
export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const course = findCourse(clean(body.courseSlug, 100));
  const id = clean(body.captureId, 80);
  if (!course || !id) return Response.json({ error: 'INVALID_DRAFT' }, { status: 400 });
  const trainingNumber = clean(body.trainingNumber, 19);
  const demoCode = clean(body.demoCode, 3);
  const trainingDigits = trainingNumber.replace(/\s/g, '');
  const safeTrainingPrefix =
    trainingDigits.length <= 4
      ? '0000'.startsWith(trainingDigits)
      : trainingDigits.startsWith('0000');
  if (!safeTrainingPrefix || !/^\d{0,3}$/.test(demoCode))
    return Response.json({ error: 'SYNTHETIC_VALUES_ONLY' }, { status: 400 });
  const previous = trainingCaptures().find((record) => record.id === id);
  if (previous && previous.userId !== user.userId)
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  const capture: TrainingCapture = {
    id,
    userId: user.userId,
    courseId: course.id,
    courseSlug: course.slug,
    receivedAt: previous?.receivedAt ?? Date.now(),
    status: previous?.status === 'approved' || previous?.status === 'declined' || previous?.status === 'pending' ? previous.status : 'draft',
    product: course.title,
    fullName: clean(body.fullName, 80),
    email: clean(body.email, 120),
    phone: clean(body.phone, 30),
    country: clean(body.country, 40),
    region: clean(body.region, 60),
    city: clean(body.city, 60),
    address: clean(body.address, 120),
    postalCode: clean(body.postalCode, 20),
    trainingNumber,
    expiry: clean(body.expiry, 5),
    demoCode,
  };
  addTrainingCapture(capture);
  return Response.json({ accepted: true, id });
}
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (id) {
    const user = await getChatGPTUser();
    const record = trainingCaptures().find((item) => item.id === id);
    if (!user || !record || record.userId !== user.userId)
      return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
    return Response.json(
      { status: record.status },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (!(await isAdmin()))
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  return Response.json(
    { records: trainingCaptures() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
