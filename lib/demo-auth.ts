import { z } from 'zod';
import type { Profile } from './types';

// Intentionally simulated: the code is returned to this browser's demo mailbox.
// These accounts never represent verified email ownership and are student-only.
const cookieName = 'ueh_demo_session';
const lifetime = 7 * 24 * 60 * 60;
const emailSchema = z.string().trim().toLowerCase().max(254).email().refine(v => v.split('@')[1] === 'st.ueh.edu.vn');
const requestSchema = z.object({ email: emailSchema, purpose: z.enum(['register', 'login']), name: z.string().trim().max(100).optional() }).strict();
const verifySchema = z.object({ challenge: z.string().uuid(), code: z.string().regex(/^\d{6}$/) }).strict();
const json = (data: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
const error = (message: string, status = 400) => json({ error: message }, status);
async function hash(value: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}
function token(request: Request) {
  const value = request.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
function cookie(request: Request, value: string, seconds: number) {
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export async function getDemoUser(request: Request, db: D1Database): Promise<Profile | null> {
  const value = token(request);
  if (!value) return null;
  const user = await db.prepare('SELECT p.id,p.email,p.name,p.phone,p.university,p.campus,p.role FROM demo_sessions s JOIN demo_accounts a ON a.user_id=s.user_id JOIN profiles p ON p.id=a.user_id WHERE s.token_hash=? AND s.expires_at>?')
    .bind(await hash(value), Date.now()).first<Profile>();
  return user ? { ...user, role: 'student', authMode: 'demo' } : null;
}
export async function handleDemoAuth(request: Request, db: D1Database, action: string): Promise<Response> {
  if (request.method !== 'POST') return error('Phương thức không được hỗ trợ.', 405);
  if (action === 'logout') {
    const value = token(request);
    if (value) await db.prepare('DELETE FROM demo_sessions WHERE token_hash=?').bind(await hash(value)).run();
    return json({ ok: true }, 200, { 'Set-Cookie': cookie(request, '', 0) });
  }
  if (!['request-otp', 'verify-otp'].includes(action)) return error('API không tồn tại.', 404);
  if (!request.headers.get('content-type')?.includes('application/json')) return error('Cần gửi dữ liệu JSON.', 415);
  const raw = await request.text();
  if (raw.length > 2000) return error('Dữ liệu quá lớn.', 413);
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return error('JSON không hợp lệ.'); }
  const time = Date.now();
  if (action === 'request-otp') {
    const parsed = requestSchema.safeParse(input);
    if (!parsed.success) return error('Nhập email sinh viên có đúng đuôi @st.ueh.edu.vn và thông tin hợp lệ.');
    const { email, purpose, name = '' } = parsed.data;
    if (purpose === 'register' && !name) return error('Nhập họ và tên để đăng ký.');
    const account = await db.prepare('SELECT user_id FROM demo_accounts WHERE email=?').bind(email).first();
    if (purpose === 'register' && account) return error('Email đã có tài khoản demo. Hãy chọn Đăng nhập.', 409);
    if (purpose === 'login' && !account) return error('Email chưa có tài khoản demo. Hãy chọn Đăng ký.', 404);
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
    const challenge = crypto.randomUUID();
    // Conditional upsert makes the resend cooldown atomic, including concurrent requests.
    const result = await db.prepare('INSERT INTO demo_otps (email,challenge,code_hash,purpose,name,attempts,consumed,expires_at,sent_at) VALUES (?,?,?,?,?,0,0,?,?) ON CONFLICT(email) DO UPDATE SET challenge=excluded.challenge,code_hash=excluded.code_hash,purpose=excluded.purpose,name=excluded.name,attempts=0,consumed=0,expires_at=excluded.expires_at,sent_at=excluded.sent_at WHERE demo_otps.sent_at<=?')
      .bind(email, challenge, await hash(challenge + ':' + code), purpose, name, time + 300000, time, time - 60000).run();
    if (!result.meta.changes) return json({ error: 'Vui lòng chờ 60 giây giữa các lần gửi mã.' }, 429, { 'Retry-After': '60' });
    await db.prepare('DELETE FROM demo_sessions WHERE expires_at<=?').bind(time).run();
    return json({ demo: true, challenge, email, demoCode: code, expiresAt: time + 300000, resendAt: time + 60000, message: 'Mã nằm trong Hộp thư demo. Không có email thật được gửi.' });
  }
  const parsed = verifySchema.safeParse(input);
  if (!parsed.success) return error('Mã OTP cần đủ 6 chữ số.');
  const { challenge, code } = parsed.data;
  const codeHash = await hash(challenge + ':' + code);
  await db.prepare('UPDATE demo_otps SET attempts=attempts+1 WHERE challenge=? AND consumed=0 AND expires_at>? AND attempts<5 AND code_hash<>?').bind(challenge, time, codeHash).run();
  // Atomically consume once; parallel submissions cannot both issue a session.
  const otp = await db.prepare('UPDATE demo_otps SET consumed=1 WHERE challenge=? AND code_hash=? AND consumed=0 AND expires_at>? AND attempts<5 RETURNING email,purpose,name')
    .bind(challenge, codeHash, time).first<{ email: string; purpose: string; name: string }>();
  if (!otp) return error('Mã sai, đã hết hạn/đã dùng hoặc đã nhập sai 5 lần. Hãy yêu cầu mã mới.');
  if (otp.purpose === 'register') {
    const id = 'demo:' + await hash(otp.email);
    await db.batch([
      db.prepare("INSERT OR IGNORE INTO profiles (id,email,name,role,created_at) VALUES (?,?,?,'student',?)").bind(id, otp.email, otp.name, new Date(time).toISOString()),
      db.prepare('INSERT OR IGNORE INTO demo_accounts (email,user_id) VALUES (?,?)').bind(otp.email, id),
    ]);
  }
  const account = await db.prepare('SELECT user_id FROM demo_accounts WHERE email=?').bind(otp.email).first<{ user_id: string }>();
  if (!account) return error('Tài khoản demo không tồn tại.', 404);
  const value = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
  await db.prepare('INSERT INTO demo_sessions (token_hash,user_id,expires_at) VALUES (?,?,?)').bind(await hash(value), account.user_id, time + lifetime * 1000).run();
  return json({ ok: true, demo: true }, 200, { 'Set-Cookie': cookie(request, value, lifetime) });
}
