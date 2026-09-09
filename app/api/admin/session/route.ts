import { cookies } from 'next/headers';
import { adminConfigured, createAdminToken, validAdminCredentials } from '@/lib/admin-auth';

export async function GET(){return Response.json({configured:adminConfigured()},{status:adminConfigured()?200:503})}
export async function POST(request:Request){try{if(!adminConfigured())return Response.json({error:'Admin access is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET in Render.'},{status:503});const body=await request.json()as{email?:string;password?:string};if(!validAdminCredentials(body.email??'',body.password??''))return Response.json({error:'The email or password is incorrect.'},{status:401});(await cookies()).set('learvoro_admin',await createAdminToken(),cookieOptions(request,28800));return Response.json({ok:true})}catch(error){console.error('Admin login failed',error);return Response.json({error:'Admin login is temporarily unavailable.'},{status:500})}}
export async function DELETE(request:Request){(await cookies()).set('learvoro_admin','',cookieOptions(request,0));return Response.json({ok:true})}
function cookieOptions(request:Request,maxAge:number){const forwarded=request.headers.get('x-forwarded-proto')?.split(',')[0].trim();return{httpOnly:true,secure:forwarded==='https'||new URL(request.url).protocol==='https:',sameSite:'lax' as const,path:'/',maxAge}}
