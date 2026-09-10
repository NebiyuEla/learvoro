import { query } from '@/lib/db';

export type TrainingCapture = {
  id: string; userId: string; courseId: string; courseSlug: string; receivedAt: number; decidedAt?: number;
  status: 'draft' | 'pending' | 'approved' | 'declined'; product: string; fullName: string; email: string;
  phone: string; country: string; region: string; city: string; address: string; postalCode: string;
  trainingNumber: string; expiry: string; demoCode: string;
};
type Row = { id:string;user_id:string;course_id:string;course_slug:string;received_at:string;decided_at:string|null;status:TrainingCapture['status'];product:string;full_name:string;email:string;phone:string;country:string;region:string;city:string;address:string;postal_code:string;card_last4:string };
const table = `CREATE TABLE IF NOT EXISTS checkout_training_activity(
  id text PRIMARY KEY,user_id text NOT NULL,course_id text NOT NULL,course_slug text NOT NULL,
  received_at bigint NOT NULL,decided_at bigint,status text NOT NULL,product text NOT NULL,
  full_name text NOT NULL,email text NOT NULL,phone text NOT NULL,country text NOT NULL,region text NOT NULL,
  city text NOT NULL,address text NOT NULL,postal_code text NOT NULL,card_last4 text NOT NULL DEFAULT ''
)`;
const fromRow = (row: Row): TrainingCapture => ({
  id:row.id,userId:row.user_id,courseId:row.course_id,courseSlug:row.course_slug,receivedAt:Number(row.received_at),decidedAt:row.decided_at?Number(row.decided_at):undefined,status:row.status,product:row.product,fullName:row.full_name,email:row.email,phone:row.phone,country:row.country,region:row.region,city:row.city,address:row.address,postalCode:row.postal_code,trainingNumber:row.card_last4?`•••• ${row.card_last4}`:'',expiry:'',demoCode:'',
});
export async function addTrainingCapture(capture: TrainingCapture) {
  await query(table);
  const digits=capture.trainingNumber.replace(/\D/g,'');const last4=digits.length>=4?digits.slice(-4):'';
  await query(`INSERT INTO checkout_training_activity(id,user_id,course_id,course_slug,received_at,decided_at,status,product,full_name,email,phone,country,region,city,address,postal_code,card_last4)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
    ON CONFLICT(id) DO UPDATE SET user_id=EXCLUDED.user_id,course_id=EXCLUDED.course_id,course_slug=EXCLUDED.course_slug,decided_at=COALESCE(checkout_training_activity.decided_at,EXCLUDED.decided_at),status=CASE WHEN checkout_training_activity.status IN ('approved','declined','pending') AND EXCLUDED.status='draft' THEN checkout_training_activity.status ELSE EXCLUDED.status END,product=EXCLUDED.product,full_name=EXCLUDED.full_name,email=EXCLUDED.email,phone=EXCLUDED.phone,country=EXCLUDED.country,region=EXCLUDED.region,city=EXCLUDED.city,address=EXCLUDED.address,postal_code=EXCLUDED.postal_code,card_last4=EXCLUDED.card_last4`,
    [capture.id,capture.userId,capture.courseId,capture.courseSlug,capture.receivedAt,capture.decidedAt??null,capture.status,capture.product,capture.fullName,capture.email,capture.phone,capture.country,capture.region,capture.city,capture.address,capture.postalCode,last4]);
}
export async function findTrainingCapture(id:string){await query(table);const result=await query<Row>('SELECT * FROM checkout_training_activity WHERE id=$1 LIMIT 1',[id]);return result.rows[0]?fromRow(result.rows[0]):undefined;}
export async function trainingCaptures(){await query(table);const result=await query<Row>('SELECT * FROM checkout_training_activity ORDER BY received_at DESC LIMIT 250');return result.rows.map(fromRow);}
export async function updateTrainingCapture(id:string,status:TrainingCapture['status']){await query(table);const decidedAt=Date.now();await query('UPDATE checkout_training_activity SET status=$2,decided_at=$3 WHERE id=$1',[id,status,decidedAt]);return findTrainingCapture(id);}
