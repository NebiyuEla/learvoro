import { isAdmin } from '@/lib/admin-auth';
import {
  addTrainingCapture,
  trainingCaptures,
  type TrainingCapture,
} from '@/lib/training-capture';

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
export async function POST(request: Request) {
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
    values.country === 'United States' &&
    values.region === 'California' &&
    values.city === 'San Francisco' &&
    /^\d{3} Training Avenue$/.test(values.address) &&
    /^9\d{4}$/.test(values.postalCode) &&
    /^0000 \d{4} \d{4} \d{4}$/.test(values.trainingNumber) &&
    values.expiry === '12/30' &&
    /^\d{3}$/.test(values.demoCode);
  if (!synthetic)
    return Response.json({ error: 'SYNTHETIC_VALUES_ONLY' }, { status: 400 });
  const capture: TrainingCapture = {
    id: crypto.randomUUID(),
    receivedAt: Date.now(),
    product: clean(body.product, 180),
    ...values,
  };
  addTrainingCapture(capture);
  return Response.json({ accepted: true, id: capture.id });
}
export async function GET() {
  if (!(await isAdmin()))
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  return Response.json(
    { records: trainingCaptures() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
