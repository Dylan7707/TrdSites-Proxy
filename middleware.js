export const config = {
  matcher: '/:path*',
};

export default async function middleware(request) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  if (
    subdomain &&
    subdomain !== 'www' &&
    subdomain !== 'trdsites' &&
    hostname.endsWith('.trdsites.com')
  ) {
    const backendUrl = process.env.REPLIT_BACKEND_URL;
    if (!backendUrl) {
      return new Response('Backend not configured', { status: 500 });
    }

    const apiUrl = `${backendUrl}/site/${subdomain}`;

    try {
      const res = await fetch(apiUrl);
      const html = await res.text();

      return new Response(html, {
        status: res.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    } catch (err) {
      return new Response('Service temporarily unavailable', { status: 502 });
    }
  }

  return undefined;
}
