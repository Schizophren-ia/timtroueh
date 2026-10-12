import { env } from 'cloudflare:workers';
export async function GET(request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp|mp4)$/.test(filename)) return new Response('Not found', { status: 404 });
  const object = await env.BUCKET?.get(`uploads/${filename}`);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers({ 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' });
  object.writeHttpMetadata(headers); headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
}
