import { isAdmin } from '@/lib/admin-auth';
import {
  addTrainingCapture,
  trainingCaptures,
  type TrainingCapture,
} from '@/lib/training-capture';

const expected = {
  fullName: 'Alex Student',
  email: 'alex.student@example.edu',
  phone: '+1 555 010 2026',
  country: 'United States',
  region: 'California',
  city: 'San Francisco',
  address: '123 University Avenue',
  postalCode: '94107',
  trainingNumber: '1111 2222 3333 4444',
  expiry: '12/30',
  demoCode: '123',
};
const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'INVALID_TRAINING_DATA' }, { status: 400 });
  }
  for (const [key, value] of Object.entries(expected)) {
    if (clean(body[key], 180) !== value)
      return Response.json({ error: 'SYNTHETIC_VALUES_ONLY' }, { status: 400 });
  }
  const capture: TrainingCapture = {
    id: crypto.randomUUID(),
    receivedAt: Date.now(),
    product: clean(body.product, 180),
    ...expected,
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
