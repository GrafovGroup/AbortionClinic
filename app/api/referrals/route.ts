export function POST() {
  return Response.json(
    {error: 'Connection requests are closed. Contact the listed clinic directly.'},
    {status: 410, headers: {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow'}},
  );
}
