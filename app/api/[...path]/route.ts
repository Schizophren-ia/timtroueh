import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { handleApi } from '@/lib/server';
export const dynamic = 'force-dynamic';
async function handler(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database chưa được cấu hình.' }, { status: 503 });
  return handleApi(request, env.DB, await getChatGPTUser(), { adminEmail: env.ADMIN_EMAIL, bucket: env.BUCKET });
}
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
