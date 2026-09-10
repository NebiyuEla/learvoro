export default function CheckoutLoading() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2" aria-label="Loading checkout">
      <section className="bg-[#f7f8fa] px-6 py-12 lg:flex lg:justify-end lg:px-12">
        <div className="w-full max-w-[520px] animate-pulse">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-10 h-10 w-40 rounded bg-slate-200" />
          <div className="mt-12 h-5 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-9 w-full max-w-md rounded bg-slate-200" />
          <div className="mt-6 h-11 w-32 rounded bg-slate-200" />
          <div className="mt-10 h-40 rounded-xl bg-slate-200" />
        </div>
      </section>
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-[500px] animate-pulse">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="mt-10 grid grid-cols-2 gap-3"><div className="h-12 rounded bg-slate-200" /><div className="h-12 rounded bg-slate-200" /></div>
          <div className="mt-9 h-4 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-12 rounded bg-slate-200" />
          <div className="mt-8 h-4 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-64 rounded-xl bg-slate-200" />
          <div className="mt-6 h-14 rounded-lg bg-slate-200" />
        </div>
      </section>
    </main>
  );
}
