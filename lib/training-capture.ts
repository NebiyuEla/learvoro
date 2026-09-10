export type TrainingCapture = {
  id: string;
  userId: string;
  courseId: string;
  courseSlug: string;
  receivedAt: number;
  decidedAt?: number;
  status: 'draft' | 'pending' | 'approved' | 'declined';
  product: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  address: string;
  postalCode: string;
  trainingNumber: string;
  expiry: string;
  demoCode: string;
};
const globalStore = globalThis as unknown as {
  learvoroTrainingCaptures?: TrainingCapture[];
};
export const trainingCaptures = () =>
  (globalStore.learvoroTrainingCaptures ??= []);
export function addTrainingCapture(capture: TrainingCapture) {
  const records = trainingCaptures();
  const existing = records.findIndex((record) => record.id === capture.id);
  if (existing >= 0) records.splice(existing, 1);
  records.unshift(capture);
  records.splice(20);
}
export function updateTrainingCapture(
  id: string,
  values: Partial<TrainingCapture>,
) {
  const record = findTrainingCapture(id);
  if (record) Object.assign(record, values);
  return record;
}
export function findTrainingCapture(id: string) {
  return trainingCaptures().find((record) => record.id === id);
}
