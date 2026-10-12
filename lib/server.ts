import { z } from 'zod';
import { seedDatabase } from './seed';
import { campuses, checklistLabels, type Profile, type Room } from './types';

type Identity = { userId: string; email: string; displayName: string } | null;
type Options = { adminEmail?: string; bucket?: R2Bucket };
class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
function fail(status: number, message: string): never { throw new HttpError(status, message); }
const now = () => new Date().toISOString();
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const str = (max: number) => z.string().trim().min(1).max(max);
const cost = z.number().int().min(0).max(100000000);
const asset = z.string().max(2000).refine(s => !s || /^https:\/\/[^\s]+$/.test(s) || /^\/assets\/[\w.\/-]+$/.test(s), 'Đường dẫn ảnh/video không hợp lệ');
const roomSchema = z.object({
  ownerId: z.string().max(150).nullable().optional(), code: str(50), title: str(160), price: cost.min(100000), type: z.enum(['single', 'shared']), district: str(80), status: z.enum(['available', 'full', 'draft']),
  area: z.number().min(5).max(500), capacity: z.number().int().min(1).max(20), floor: str(80), address: str(300), university: z.enum(['UEH', 'HCMUT', 'HCMUS']),
  latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180),
  distances: z.record(z.number().min(0).max(1000)), images: z.array(asset.refine(s => !!s)).min(1).max(12), amenities: z.array(str(80)).max(20),
  electricityRate: cost, electricityUsage: z.number().min(0).max(10000), waterRate: cost, waterUsage: z.number().min(0).max(100),
  wifi: cost, service: cost, parking: cost, deposit: cost, verifiedPeople: z.boolean(), verifiedInfo: z.boolean(), verifiedMedia: z.boolean(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), landlordName: str(100), contactPhone: z.string().trim().max(30).refine(s => !s || /^\+?[\d\s.-]{9,20}$/.test(s)),
  description: str(3000), sourceURL: asset, panoramaURL: asset, videoURL: asset,
}).strict();
const reviewSchema = z.object({ category: z.enum(['room', 'landlord', 'other']), rating: z.number().int().min(1).max(5), landlordScore: z.number().int().min(1).max(5), roomScore: z.number().int().min(1).max(5), infoScore: z.number().int().min(1).max(5), body: str(1500), checklist: z.array(z.enum(checklistLabels as [string, ...string[]])).max(6) }).strict();
async function body<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  if (!request.headers.get('content-type')?.includes('application/json')) fail(415, 'Cần gửi dữ liệu JSON.');
  const raw = await request.text();
  if (raw.length > 200000) fail(413, 'Dữ liệu quá lớn.');
  let value: unknown; try { value = JSON.parse(raw); } catch { return fail(400, 'JSON không hợp lệ.'); }
  const result = schema.safeParse(value);
  if (!result.success) fail(400, result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
  return result.data;
}
export async function getProfile(db: D1Database, identity: Identity, adminEmail?: string): Promise<Profile | null> {
  if (!identity) return null;
  await db.prepare('INSERT OR IGNORE INTO profiles (id,email,name,role,created_at) VALUES (?,?,?,?,?)').bind(identity.userId, identity.email, identity.displayName, adminEmail && identity.email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'student', now()).run();
  return await db.prepare('SELECT id,email,name,phone,university,campus,role FROM profiles WHERE id=?').bind(identity.userId).first<Profile>();
}
const requireUser = (p: Profile | null): Profile => p ?? fail(401, 'Đăng nhập để sử dụng tính năng này.');
const requireAdmin = (p: Profile | null): Profile => { const u = requireUser(p); if (u.role !== 'admin') fail(403, 'Chỉ quản trị viên được thực hiện thao tác này.'); return u; };
const editable = (r: Room, u: Profile) => u.role === 'admin' || u.role === 'landlord' && r.ownerId === u.id;
const roomFromRow = (row: Record<string, unknown>): Room => ({ ...JSON.parse(String(row.data)), id: row.id, code: row.code, title: row.title, price: row.price, type: row.type, district: row.district, status: row.status, ownerId: row.owner_id, rating: Number(row.rating || 0), reviewCount: Number(row.review_count || 0), favorite: Boolean(row.favorite) });
const roomSelect = `SELECT r.*, (SELECT AVG(rating) FROM reviews WHERE room_id=r.id AND status='published') AS rating, (SELECT COUNT(*) FROM reviews WHERE room_id=r.id AND status='published') AS review_count`;
async function findRoom(db: D1Database, id: string, user: Profile | null): Promise<Room> {
  const row = await db.prepare(roomSelect + ' FROM rooms r WHERE r.id=?').bind(id).first<Record<string, unknown>>();
  if (!row) fail(404, 'Không tìm thấy phòng.');
  const room = roomFromRow(row);
  if (room.status === 'draft' && !(user && editable(room, user))) fail(404, 'Không tìm thấy phòng.');
  return room;
}
function notification(db: D1Database, userId: string, title: string, message: string, link: string) {
  return db.prepare('INSERT INTO notifications (id,user_id,title,body,link,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), userId, title, message, link, now());
}
export async function handleApi(request: Request, db: D1Database, identity: Identity, options: Options = {}): Promise<Response> {
  try {
    const url = new URL(request.url), path = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean), method = request.method;
    if (!['GET', 'HEAD'].includes(method)) {
      const origin = request.headers.get('origin');
      if (origin && origin !== url.origin) fail(403, 'Nguồn yêu cầu không hợp lệ.');
    }
    await seedDatabase(db);
    const user = await getProfile(db, identity, options.adminEmail);
    if (path[0] === 'health' && method === 'GET') return json({ ok: true, database: 'D1', demo: true });
    if (path[0] === 'session' && method === 'GET') return json({ user });
    if (path[0] === 'profile' && method === 'PATCH') {
      const u = requireUser(user);
      const input = await body(request, z.object({ name: str(100), phone: z.string().trim().max(30), university: z.enum(['UEH', 'HCMUT', 'HCMUS']), campus: z.string() }).strict());
      if (!campuses.some(c => c.id === input.campus && c.university === input.university)) fail(400, 'Campus không thuộc trường đã chọn.');
      await db.prepare('UPDATE profiles SET name=?,phone=?,university=?,campus=? WHERE id=?').bind(input.name, input.phone, input.university, input.campus, u.id).run();
      return json({ user: { ...u, ...input } });
    }
    if (path[0] === 'rooms') {
      if (!path[1] && method === 'GET') {
        const admin = url.searchParams.get('manage') === '1';
        if (admin && requireUser(user).role === 'student') fail(403, 'Bạn chưa có quyền quản lý phòng.');
        const favoritesOnly = url.searchParams.get('favorites') === '1';
        if (favoritesOnly) requireUser(user);
        let query = roomSelect + `, EXISTS(SELECT 1 FROM favorites WHERE room_id=r.id AND user_id=?) AS favorite FROM rooms r WHERE 1=1`;
        const args: (string | number)[] = [user?.id ?? ''];
        if (admin && user?.role === 'landlord') { query += ' AND r.owner_id=?'; args.push(user.id); }
        if (!admin) query += " AND r.status!='draft'";
        if (favoritesOnly) { query += ' AND EXISTS(SELECT 1 FROM favorites WHERE room_id=r.id AND user_id=?)'; args.push(user!.id); }
        if (url.searchParams.get('type')) { query += ' AND r.type=?'; args.push(url.searchParams.get('type')!); }
        if (url.searchParams.get('district')) { query += ' AND r.district=?'; args.push(url.searchParams.get('district')!); }
        if (url.searchParams.get('available') === '1') query += " AND r.status='available'";
        if (url.searchParams.get('q')) { query += " AND (r.title LIKE ? OR r.code LIKE ? OR r.district LIKE ?)"; const q = '%' + url.searchParams.get('q')!.slice(0, 100) + '%'; args.push(q, q, q); }
        for (const [param, operator] of [['min', '>='], ['max', '<=']]) {
          const value = url.searchParams.get(param);
          if (value !== null && value !== '') { if (!Number.isFinite(Number(value)) || Number(value) < 0) fail(400, 'Khoảng giá không hợp lệ.'); query += ` AND r.price${operator}?`; args.push(Number(value)); }
        }
        const rows = await db.prepare(query).bind(...args).all<Record<string, unknown>>();
        const campus = url.searchParams.get('campus') ?? 'B', maxDistance = Number(url.searchParams.get('distance') || 1000);
        if (!campuses.some(c => c.id === campus) || !Number.isFinite(maxDistance) || maxDistance < 0) fail(400, 'Khoảng cách hoặc campus không hợp lệ.');
        let rooms = rows.results.map(roomFromRow).filter(r => (r.distances[campus] ?? Infinity) <= maxDistance);
        if (url.searchParams.get('verified') === '1') rooms = rooms.filter(r => r.verifiedPeople && r.verifiedInfo && r.verifiedMedia);
        const sort = url.searchParams.get('sort');
        rooms.sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'distance' ? (a.distances[campus] ?? Infinity) - (b.distances[campus] ?? Infinity) : sort === 'rating' ? (b.rating ?? 0) - (a.rating ?? 0) : a.id.localeCompare(b.id, undefined, { numeric: true }));
        return json({ rooms, total: rooms.length });
      }
      if (path[1] && !path[2] && method === 'GET') return json({ room: await findRoom(db, path[1], user) });
      if (path[1] && path[2] === 'reviews' && method === 'GET') {
        await findRoom(db, path[1], user);
        const rows = await db.prepare("SELECT * FROM reviews WHERE room_id=? AND status='published' ORDER BY created_at DESC").bind(path[1]).all();
        return json({ reviews: rows.results });
      }
      if (path[1] && path[2] === 'reviews' && method === 'POST') {
        const u = requireUser(user); await findRoom(db, path[1], user); const input = await body(request, reviewSchema);
        if (await db.prepare("SELECT id FROM reviews WHERE room_id=? AND user_id=? AND status!='rejected'").bind(path[1], u.id).first()) fail(409, 'Bạn đã gửi đánh giá cho phòng này.');
        const id = crypto.randomUUID();
        await db.batch([db.prepare('INSERT INTO reviews (id,room_id,user_id,name,category,rating,landlord_score,room_score,info_score,body,status,checklist,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id, path[1], u.id, u.name, input.category, input.rating, input.landlordScore, input.roomScore, input.infoScore, input.body, 'pending', JSON.stringify(input.checklist), now()), notification(db, u.id, 'Đã nhận đánh giá', 'Đánh giá của bạn đang chờ quản trị viên duyệt.', `/rooms/${path[1]}/reviews`)]);
        return json({ id, message: 'Đánh giá đã được gửi và đang chờ duyệt.' }, 201);
      }
      if (!path[1] && method === 'POST' || path[1] && !path[2] && method === 'PATCH') {
        const u = requireUser(user); if (u.role === 'student') fail(403, 'Bạn chưa có quyền đăng phòng.');
        const existing = path[1] ? await findRoom(db, path[1], user) : null;
        if (existing && !editable(existing, u)) fail(403, 'Bạn chỉ được sửa phòng của mình.');
        const input = await body(request, roomSchema);
        if (u.role !== 'admin') {
          if (['verifiedPeople', 'verifiedInfo', 'verifiedMedia'].some(k => input[k as 'verifiedPeople'] !== (existing?.[k as 'verifiedPeople'] ?? false))) fail(403, 'Chỉ quản trị viên được cập nhật xác thực.');
          if (existing && (input.address !== existing.address || input.area !== existing.area || JSON.stringify(input.images) !== JSON.stringify(existing.images))) { input.verifiedInfo = false; input.verifiedMedia = false; }
        }
        if (u.role === 'admin' && input.ownerId) {
          const owner = await db.prepare('SELECT role FROM profiles WHERE id=?').bind(input.ownerId).first<{role: string}>();
          if (!owner || owner.role === 'student') fail(400, 'Tài khoản quản lý phải là chủ trọ hoặc quản trị viên.');
        }
        for (const c of campuses) if (!(c.id in input.distances)) fail(400, 'Cần khoảng cách đến tất cả campus.');
        const id = existing?.id ?? crypto.randomUUID();
        const room: Room = { ...input, id, ownerId: u.role === 'admin' && input.ownerId !== undefined ? input.ownerId : existing?.ownerId ?? u.id };
        await db.prepare('INSERT INTO rooms (id,code,title,price,type,district,status,owner_id,data,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET code=excluded.code,title=excluded.title,price=excluded.price,type=excluded.type,district=excluded.district,status=excluded.status,owner_id=excluded.owner_id,data=excluded.data,updated_at=excluded.updated_at').bind(id, room.code, room.title, room.price, room.type, room.district, room.status, room.ownerId, JSON.stringify(room), now()).run();
        return json({ room }, existing ? 200 : 201);
      }
      if (path[1] && !path[2] && method === 'DELETE') {
        const u = requireUser(user), room = await findRoom(db, path[1], user);
        if (!editable(room, u)) fail(403, 'Bạn không có quyền gỡ phòng này.');
        await db.prepare("UPDATE rooms SET status='draft',updated_at=? WHERE id=?").bind(now(), room.id).run();
        return json({ message: 'Phòng đã được chuyển về bản nháp.' });
      }
    }
    if (path[0] === 'favorites' && path[1] && ['POST', 'DELETE'].includes(method)) {
      const u = requireUser(user); await findRoom(db, path[1], user);
      if (method === 'POST') await db.prepare('INSERT OR IGNORE INTO favorites (user_id,room_id,created_at) VALUES (?,?,?)').bind(u.id, path[1], now()).run();
      else await db.prepare('DELETE FROM favorites WHERE user_id=? AND room_id=?').bind(u.id, path[1]).run();
      return json({ favorite: method === 'POST' });
    }
    if (path[0] === 'inquiries') {
      const u = requireUser(user);
      if (method === 'POST' && !path[1]) {
        const input = await body(request, z.object({ roomId: str(80), message: str(200) }).strict());
        const room = await findRoom(db, input.roomId, user); if (room.status !== 'available') fail(409, 'Phòng hiện không còn trống.');
        const count = await db.prepare('SELECT COUNT(*) AS n FROM inquiries WHERE user_id=? AND created_at>?').bind(u.id, new Date(Date.now() - 3600000).toISOString()).first<{n: number}>();
        if ((count?.n ?? 0) >= 10) fail(429, 'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau.');
        const id = crypto.randomUUID(), items = [db.prepare('INSERT INTO inquiries (id,room_id,user_id,message,created_at) VALUES (?,?,?,?,?)').bind(id, room.id, u.id, input.message, now()), notification(db, u.id, 'Yêu cầu liên hệ đã được lưu', `Yêu cầu cho phòng ${room.code} đang chờ phản hồi trong bản mô phỏng.`, '/account')];
        if (room.ownerId && room.ownerId !== u.id) items.push(notification(db, room.ownerId, 'Có yêu cầu liên hệ mới', `${u.name} quan tâm phòng ${room.code}.`, '/manage'));
        await db.batch(items); return json({ id, message: 'Đã lưu yêu cầu liên hệ trong hệ thống mô phỏng.' }, 201);
      }
      if (method === 'GET') {
        let clause = 'i.user_id=?', args: string[] = [u.id];
        if (url.searchParams.get('manage') === '1') { if (u.role === 'student') fail(403, 'Không có quyền.'); clause = u.role === 'admin' ? '1=1' : 'r.owner_id=?'; args = u.role === 'admin' ? [] : [u.id]; }
        const rows = await db.prepare(`SELECT i.*,r.title,r.code,p.name,p.email FROM inquiries i JOIN rooms r ON r.id=i.room_id JOIN profiles p ON p.id=i.user_id WHERE ${clause} ORDER BY i.created_at DESC`).bind(...args).all();
        return json({ inquiries: rows.results });
      }
      if (path[1] && method === 'PATCH') {
        const item = await db.prepare('SELECT i.*,r.owner_id FROM inquiries i JOIN rooms r ON r.id=i.room_id WHERE i.id=?').bind(path[1]).first<{ user_id: string; room_id: string; owner_id: string | null }>();
        if (!item) fail(404, 'Yêu cầu không tồn tại.');
        if (u.role !== 'admin' && !(u.role === 'landlord' && item.owner_id === u.id)) fail(403, 'Bạn không có quyền phản hồi.');
        const input = await body(request, z.object({ reply: str(1500), status: z.enum(['replied', 'closed']) }).strict());
        await db.batch([db.prepare('UPDATE inquiries SET reply=?,status=? WHERE id=?').bind(input.reply, input.status, path[1]), notification(db, item.user_id, 'Yêu cầu của bạn đã được phản hồi', input.reply, '/account')]);
        return json({ ok: true });
      }
    }
    if (path[0] === 'notifications') {
      const u = requireUser(user);
      if (method === 'GET') return json({ notifications: (await db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC').bind(u.id).all()).results });
      if (method === 'PATCH') { await db.prepare(path[1] ? 'UPDATE notifications SET read=1 WHERE user_id=? AND id=?' : 'UPDATE notifications SET read=1 WHERE user_id=?').bind(...(path[1] ? [u.id, path[1]] : [u.id])).run(); return json({ ok: true }); }
    }
    if (path[0] === 'admin') {
      const u = requireAdmin(user);
      if (path[1] === 'users' && method === 'GET') return json({ users: (await db.prepare('SELECT id,email,name,role FROM profiles ORDER BY created_at DESC').all()).results });
      if (path[1] === 'users' && path[2] && method === 'PATCH') {
        const input = await body(request, z.object({ role: z.enum(['student', 'landlord', 'admin']) }).strict());
        if (path[2] === u.id && input.role !== 'admin') fail(409, 'Không thể tự hạ quyền quản trị.');
        const result = await db.prepare('UPDATE profiles SET role=? WHERE id=?').bind(input.role, path[2]).run();
        if (!result.meta.changes) fail(404, 'Tài khoản không tồn tại.'); return json({ ok: true });
      }
      if (path[1] === 'reviews' && method === 'GET') return json({ reviews: (await db.prepare("SELECT v.*,r.title FROM reviews v JOIN rooms r ON r.id=v.room_id WHERE v.status='pending' ORDER BY v.created_at DESC").all()).results });
      if (path[1] === 'reviews' && path[2] && method === 'PATCH') {
        const input = await body(request, z.object({ status: z.enum(['published', 'rejected']) }).strict());
        const review = await db.prepare("SELECT * FROM reviews WHERE id=? AND status='pending'").bind(path[2]).first<{user_id: string; room_id: string}>();
        if (!review) fail(404, 'Không tìm thấy đánh giá chờ duyệt.');
        await db.batch([db.prepare('UPDATE reviews SET status=? WHERE id=?').bind(input.status, path[2]), notification(db, review.user_id, 'Đánh giá đã được xử lý', input.status === 'published' ? 'Đánh giá của bạn đã được đăng.' : 'Đánh giá chưa được duyệt. Bạn có thể gửi lại nội dung phù hợp.', `/rooms/${review.room_id}/reviews`)]);
        return json({ ok: true });
      }
    }
    if (path[0] === 'uploads' && method === 'POST') {
      const u = requireUser(user); if (u.role === 'student') fail(403, 'Chỉ chủ trọ và quản trị viên được tải tệp.');
      if (!options.bucket) fail(503, 'Kho lưu trữ chưa sẵn sàng.');
      if (Number(request.headers.get('content-length')) > 9000000) fail(413, 'Tệp quá lớn.');
      const form = await request.formData(), file = form.get('file');
      if (!(file instanceof File) || file.size === 0 || file.size > 8000000) fail(400, 'Chọn tệp tối đa 8MB.');
      const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'video/mp4': 'mp4' };
      const ext = extensions[file.type]; if (!ext) fail(400, 'Chỉ hỗ trợ JPG, PNG, WebP và MP4.');
      const bytes = new Uint8Array(await file.arrayBuffer());
      const valid = ext === 'jpg' ? bytes[0] === 255 && bytes[1] === 216 : ext === 'png' ? bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 : ext === 'webp' ? new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP' : new TextDecoder().decode(bytes.slice(4, 8)) === 'ftyp';
      if (!valid) fail(400, 'Nội dung tệp không khớp định dạng.');
      const key = `uploads/${crypto.randomUUID()}.${ext}`;
      await options.bucket.put(key, bytes, { httpMetadata: { contentType: file.type } }); return json({ url: `/assets/${key}` }, 201);
    }
    fail(404, 'API không tồn tại.');
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    if (String(error).includes('UNIQUE constraint failed')) return json({ error: 'Mã phòng đã tồn tại.' }, 409);
    console.error('API error', error);
    return json({ error: 'Máy chủ chưa xử lý được yêu cầu. Vui lòng thử lại.' }, 500);
  }
}
