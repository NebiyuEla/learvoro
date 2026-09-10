import { cookies } from 'next/headers';

const PRODUCTION_ORIGIN = 'https://learvoro.com';

export async function GET(request: Request) {
  (await cookies()).delete('learvoro_session');
  const requestUrl = new URL(request.url);
  const returnTo = requestUrl.searchParams.get('returnTo');
  const safePath = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
  const origin = process.env.NODE_ENV === 'production' ? PRODUCTION_ORIGIN : requestUrl.origin;
  return Response.redirect(new URL(safePath, origin));
}
