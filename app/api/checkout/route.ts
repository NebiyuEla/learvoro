import { env } from '@/lib/runtime';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { findCourse } from '@/lib/course-data';
import { StripePaymentProvider } from '@/server/payments/stripe';

const runtime=()=>env as unknown as Record<string,string|undefined>;
export async function POST(request:Request){
  const user=await getChatGPTUser();
  if(!user)return Response.json({error:'AUTHENTICATION_REQUIRED'},{status:401});
  const body=await request.json().catch(()=>({})) as {courseSlug?:string}; const course=findCourse(body.courseSlug??'');
  if(!course)return Response.json({error:'COURSE_UNAVAILABLE'},{status:404});
  const secret=runtime().STRIPE_SECRET_KEY;
  const publishableKey=runtime().STRIPE_PUBLISHABLE_KEY;
  if(!secret||!publishableKey)return Response.json({error:'PAYMENTS_NOT_CONFIGURED'},{status:503});
  const db=(env as unknown as {DB:D1Database}).DB;
  const initNow=Math.floor(Date.now()/1000); await db.prepare("INSERT OR IGNORE INTO courses (id,title,slug,description,level,language,price,currency,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?, 'published',?,?)").bind(course.id,course.title,course.slug,course.description,course.level,course.language,course.price,course.currency,initNow,initNow).run();
  const stored=await db.prepare('SELECT id, price, currency, status FROM courses WHERE slug = ? LIMIT 1').bind(course.slug).first<{id:string;price:number;currency:string;status:string}>();
  if(!stored||stored.status!=='published')return Response.json({error:'COURSE_UNAVAILABLE'},{status:404});
  const owned=await db.prepare("SELECT id FROM entitlements WHERE user_id = ? AND course_id = ? AND status = 'active' LIMIT 1").bind(user.userId,stored.id).first();
  if(owned)return Response.json({error:'ALREADY_ENROLLED'},{status:409});
  const pending=await db.prepare("SELECT id, order_number FROM orders WHERE user_id = ? AND status = 'pending' AND id IN (SELECT order_id FROM order_items WHERE course_id = ?) ORDER BY created_at DESC LIMIT 1").bind(user.userId,stored.id).first<{id:string;order_number:string}>();
  const orderId=pending?.id??crypto.randomUUID(); const orderNumber=pending?.order_number??`CLR-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${orderId.slice(0,5).toUpperCase()}`; const now=Math.floor(Date.now()/1000);
  if(!pending)await db.batch([db.prepare('INSERT OR IGNORE INTO users (id,email,role,created_at,updated_at) VALUES (?,?,\'student\',?,?)').bind(user.userId,user.email,now,now),db.prepare('INSERT INTO orders (id,order_number,user_id,subtotal,discount,tax,total,currency,status,created_at,updated_at) VALUES (?,?,?,?,0,0,?,?,\'pending\',?,?)').bind(orderId,orderNumber,user.userId,stored.price,stored.price,stored.currency,now,now),db.prepare('INSERT INTO order_items (id,order_id,course_id,unit_price) VALUES (?,?,?,?)').bind(crypto.randomUUID(),orderId,stored.id,stored.price)]);
  const payment=await new StripePaymentProvider(secret).createPayment({amount:stored.price,currency:stored.currency,orderId,userId:user.userId,email:user.email},`checkout:${orderId}`);
  await db.prepare('INSERT OR IGNORE INTO payments (id,order_id,processor,processor_payment_id,status,amount,currency,created_at,updated_at) VALUES (?,?,\'stripe\',?,\'pending\',?,?,?,?)').bind(crypto.randomUUID(),orderId,payment.id,stored.price,stored.currency,now,now).run();
  return Response.json({orderId,orderNumber,paymentIntentId:payment.id,clientSecret:payment.clientSecret,publishableKey,amount:stored.price,currency:stored.currency});
}
