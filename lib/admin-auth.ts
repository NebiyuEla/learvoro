import { cookies } from 'next/headers';
const encoder=new TextEncoder();
const sessionSecret=()=>process.env.ADMIN_SESSION_SECRET?.trim()||process.env.AUTH_SECRET?.trim()||'';
const adminEmail=()=>process.env.ADMIN_EMAIL?.trim().toLowerCase()||'';
const adminPassword=()=>process.env.ADMIN_PASSWORD||'';
async function signature(value:string){const secret=sessionSecret();if(!secret)return'';const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(value)));return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
function equal(left:string,right:string){const length=Math.max(left.length,right.length);let result=left.length^right.length;for(let i=0;i<length;i++)result|=(left.charCodeAt(i)||0)^(right.charCodeAt(i)||0);return result===0}
export function adminConfigured(){return Boolean(adminEmail()&&adminPassword()&&sessionSecret())}
export function validAdminCredentials(email:string,password:string){return adminConfigured()&&equal(email.trim().toLowerCase(),adminEmail())&&equal(password,adminPassword())}
export async function createAdminToken(){const expires=Date.now()+8*60*60*1000,value=`admin.${expires}`;return`${value}.${await signature(value)}`}
export async function isAdmin(){const token=(await cookies()).get('learvoro_admin')?.value;if(!token)return false;const parts=token.split('.');if(parts.length!==3||parts[0]!=='admin'||!Number.isFinite(Number(parts[1]))||Number(parts[1])<Date.now())return false;const expected=await signature(`admin.${parts[1]}`);return Boolean(expected&&equal(expected,parts[2]))}
