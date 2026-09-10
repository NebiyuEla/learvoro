export type TrainingCapture = {
  id: string;
  receivedAt: number;
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
  records.unshift(capture);
  records.splice(20);
}
