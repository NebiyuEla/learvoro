'use client';
import { useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';

export function AdminLogin(){
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  async function submit(event:{preventDefault():void;currentTarget:HTMLFormElement}){
    event.preventDefault(); setBusy(true); setError('');
    const form=new FormData(event.currentTarget);
    try{
      const response=await fetch('/api/admin/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:form.get('email'),password:form.get('password')})});
      const body=await response.json().catch(()=>({})) as {error?:string};
      if(response.ok){location.assign(`/adminplatform?signedIn=${Date.now()}`);return}
      setError(body.error||'Unable to sign in to admin.');
    }catch{setError('Unable to reach the server. Please try again.')}
    setBusy(false);
  }
  return <form method="post" onSubmit={submit} className="mt-8 space-y-5">
    <label className="block text-sm font-semibold">Admin email<input name="email" type="email" required autoComplete="username" className="field"/></label>
    <label className="block text-sm font-semibold">Password<input name="password" type="password" required autoComplete="current-password" className="field"/></label>
    <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0757B2] p-3.5 font-semibold text-white disabled:opacity-60">{busy?<Loader2 className="animate-spin" size={18}/>:<LockKeyhole size={18}/>} {busy?'Signing in…':'Sign in to admin'}</button>
    {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  </form>;
}
