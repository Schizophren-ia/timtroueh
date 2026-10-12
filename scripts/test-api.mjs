import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { handleApi } from '../outputs/api-under-test.mjs';
const sqlite = new DatabaseSync(':memory:');
for (const file of readdirSync('drizzle').filter(v => v.endsWith('.sql')).sort()) sqlite.exec(readFileSync('drizzle/' + file, 'utf8'));
function prepare(sql) {
  let params = [];
  return { bind(...values) { params = values; return this; },
    async first() { return sqlite.prepare(sql).get(...params) ?? null; },
    async all() { return { results: sqlite.prepare(sql).all(...params) }; },
    async run() { const r = sqlite.prepare(sql).run(...params); return { success: true, meta: { changes: Number(r.changes) } }; },
  };
}
const db = { prepare, async batch(items) { sqlite.exec('BEGIN'); try { const results = []; for (const i of items) results.push(await i.run()); sqlite.exec('COMMIT'); return results; } catch (e) { sqlite.exec('ROLLBACK'); throw e; } } };
const admin = { userId: 'admin', email: 'admin@test.example', displayName: 'Quản trị' }, student = { userId: 'student', email: 'student@test.example', displayName: 'Sinh viên' }, other = { userId: 'other', email: 'other@test.example', displayName: 'Sinh viên khác' }, landlord = { userId: 'landlord', email: 'landlord@test.example', displayName: 'Chủ trọ' };
const options = { adminEmail: admin.email };
const studentCookies = new Map();
async function call(path, identity = null, method = 'GET', data, headers = {}) {
  if (identity === student || identity === other) {
    if (!studentCookies.has(identity.userId)) {
      const email = identity.userId + '@st.ueh.edu.vn';
      const otp = await call('demo-auth/request-otp', null, 'POST', { email, purpose: 'register', name: identity.displayName });
      assert.equal(otp.status, 200);
      const verified = await call('demo-auth/verify-otp', null, 'POST', { challenge: otp.body.challenge, code: otp.body.demoCode });
      assert.equal(verified.status, 200);
      studentCookies.set(identity.userId, verified.cookie.split(';')[0]);
    }
    headers = { Cookie: studentCookies.get(identity.userId), ...headers }; identity = null;
  }
  const request = new Request('http://test.host/api/' + path, { method, headers: { ...(data ? {'Content-Type':'application/json'} : {}), ...headers }, body: data ? JSON.stringify(data) : undefined });
  const response = await handleApi(request, db, identity, options);
  return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie') };
}
let createdRoom, reviewId, inquiryId;
test('Room fixtures, filters, sort, costs and three verification layers match the references', async () => {
  const all = await call('rooms'); assert.equal(all.status, 200); assert.equal(all.body.total, 12);
  const r1 = all.body.rooms.find(r => r.id === 'room-1'), r2 = all.body.rooms.find(r => r.id === 'room-2'), r3 = all.body.rooms.find(r => r.id === 'room-3');
  for (const [r, expected] of [[r1, 3200000], [r2, 3570000], [r3, 2900000]]) assert.equal(r.price + r.electricityRate*r.electricityUsage + r.waterRate*r.waterUsage + r.wifi + r.service + r.parking, expected);
  assert.equal(r1.reviewCount,32); assert.equal(r2.reviewCount,18); assert.equal(r3.reviewCount,25); assert.equal(r3.verifiedPeople,false);
  const filtered = await call('rooms?type=single&min=2500000&max=3500000&distance=2&campus=B&district=Quận%2010&sort=price-asc');
  assert.deepEqual(filtered.body.rooms.map(r => r.price), [2500000,2800000,3200000]);
  const verified = await call('rooms?type=single&min=2500000&max=3500000&distance=2&district=Quận%2010&verified=1'); assert.equal(verified.body.total,2);
  const n = await call('rooms?campus=N&distance=1'); assert.equal(n.body.rooms[0].district,'Bình Chánh');
  assert.equal((await call('rooms?min=NaN')).status,400); assert.equal((await call('rooms?campus=bad')).status,400);
});
test('Identity, user isolation, protected writes and profile validation', async () => {
  assert.equal((await call('session')).body.user,null);
  assert.equal((await call('favorites/room-1',null,'POST')).status,401);
  assert.equal((await call('session',admin)).body.user.role,'admin');
  assert.equal((await call('session',student)).body.user.role,'student');
  assert.equal((await call('favorites/room-1',student,'POST')).status,200);
  assert.equal((await call('rooms?favorites=1',student)).body.total,1);
  assert.equal((await call('rooms?favorites=1',other)).body.total,0);
  assert.equal((await call('favorites/room-1',student,'DELETE')).status,200);
  assert.equal((await call('rooms?favorites=1',student)).body.total,0);
  const data={name:'Tên mới',phone:'',university:'UEH',campus:'B'};
  assert.equal((await call('profile',student,'PATCH',data)).body.user.name,'Tên mới');
  assert.equal((await call('profile',student,'PATCH',{...data,role:'admin'})).status,400);
  assert.equal((await call('profile',student,'PATCH',{...data,campus:'HCMUT'})).status,400);
  assert.equal((await call('admin/users',student)).status,403);
  assert.equal((await call('favorites/room-1',student,'POST',null,{'Origin':'https://evil.example'})).status,403);
});
test('Room CRUD, role grants, ownership, drafts and landlord verification restrictions', async () => {
  await call('session',landlord);
  assert.equal((await call('admin/users/landlord',admin,'PATCH',{role:'landlord'})).status,200);
  const {id,rating,reviewCount,favorite,...data} = (await call('rooms/room-1')).body.room;
  assert.equal((await call('rooms',student,'POST',data)).status,403);
  const newData={...data,code:'TEST-ROOM',title:'Phòng kiểm thử',ownerId:'landlord',status:'draft',verifiedPeople:false,verifiedInfo:false,verifiedMedia:false};
  const result=await call('rooms',admin,'POST',newData); assert.equal(result.status,201); createdRoom=result.body.room;
  assert.equal((await call('rooms/'+createdRoom.id)).status,404);
  assert.equal((await call('rooms/'+createdRoom.id,landlord)).status,200);
  assert.equal((await call('rooms?manage=1',landlord)).body.rooms.length,1);
  assert.equal((await call('rooms/'+createdRoom.id,other,'PATCH',newData)).status,403);
  assert.equal((await call('rooms/'+createdRoom.id,landlord,'PATCH',{...newData,verifiedPeople:true})).status,403);
  assert.equal((await call('rooms/'+createdRoom.id,landlord,'PATCH',{...newData,status:'available'})).status,200);
  assert.equal((await call('rooms/'+createdRoom.id)).status,200);
  assert.equal((await call('rooms',admin,'POST',newData)).status,409);
  assert.equal((await call('admin/users/admin',admin,'PATCH',{role:'student'})).status,409);
});
test('Reviews remain pending until an admin approves; averages and notifications update', async () => {
  const input={category:'room',rating:4,landlordScore:5,roomScore:4,infoScore:4,body:'Phòng kiểm thử sạch sẽ.',checklist:['Sạch sẽ','An ninh tốt']};
  const result=await call('rooms/'+createdRoom.id+'/reviews',student,'POST',input); assert.equal(result.status,201); reviewId=result.body.id;
  assert.equal((await call('rooms/'+createdRoom.id+'/reviews')).body.reviews.length,0);
  assert.equal((await call('rooms/'+createdRoom.id+'/reviews',student,'POST',input)).status,409);
  assert.equal((await call('admin/reviews/'+reviewId,landlord,'PATCH',{status:'published'})).status,403);
  assert.equal((await call('admin/reviews/'+reviewId,admin,'PATCH',{status:'published'})).status,200);
  assert.equal((await call('rooms/'+createdRoom.id)).body.room.rating,4);
  assert.equal((await call('rooms/'+createdRoom.id+'/reviews')).body.reviews.length,1);
  assert.ok((await call('notifications',student)).body.notifications.some(n=>n.title==='Đánh giá đã được xử lý'));
});
test('Inquiries persist, stay private and accept replies only from the responsible landlord/admin', async () => {
  const result=await call('inquiries',student,'POST',{roomId:createdRoom.id,message:'Mình muốn xem phòng.'}); assert.equal(result.status,201); inquiryId=result.body.id;
  assert.equal((await call('inquiries',other)).body.inquiries.length,0);
  assert.equal((await call('inquiries?manage=1',landlord)).body.inquiries[0].id,inquiryId);
  assert.equal((await call('inquiries/'+inquiryId,other,'PATCH',{reply:'hello',status:'replied'})).status,403);
  assert.equal((await call('inquiries/'+inquiryId,landlord,'PATCH',{reply:'Bạn có thể đến xem vào chiều mai.',status:'replied'})).status,200);
  assert.equal((await call('inquiries',student)).body.inquiries[0].status,'replied');
  assert.ok((await call('notifications',student)).body.notifications.some(n=>n.title==='Yêu cầu của bạn đã được phản hồi'));
  await call('notifications',student,'PATCH'); assert.ok((await call('notifications',student)).body.notifications.every(n=>n.read===1));
  assert.equal((await call('rooms/'+createdRoom.id,landlord,'DELETE')).status,200);
  assert.equal((await call('rooms/'+createdRoom.id)).status,404);
});

test('Demo OTP validates the exact UEH domain, creates no account before verification and cannot grant staff privileges', async () => {
  for (const email of ['demo@gmail.com', 'demo@ueh.edu.vn', 'demo@st.ueh.edu.vn.evil.com', 'demo@sub.st.ueh.edu.vn']) {
    assert.equal((await call('demo-auth/request-otp', null, 'POST', {email,purpose:'register',name:'Demo'})).status,400);
  }
  const email='demo-auth@st.ueh.edu.vn';
  assert.equal((await call('demo-auth/request-otp',null,'POST',{email,purpose:'login'})).status,404);
  const otp=await call('demo-auth/request-otp',null,'POST',{email:' DEMO-AUTH@ST.UEH.EDU.VN ',purpose:'register',name:'Demo UEH'});
  assert.equal(otp.status,200);assert.equal(otp.body.demo,true);assert.match(otp.body.demoCode,/^\d{6}$/);
  assert.equal(sqlite.prepare('SELECT * FROM demo_accounts WHERE email=?').get(email),undefined);
  assert.notEqual(sqlite.prepare('SELECT code_hash FROM demo_otps WHERE email=?').get(email).code_hash,otp.body.demoCode);
  assert.equal((await call('demo-auth/request-otp',null,'POST',{email,purpose:'register',name:'Demo'})).status,429);
  const payload={challenge:otp.body.challenge,code:otp.body.demoCode};
  const verified=await call('demo-auth/verify-otp',null,'POST',payload);
  assert.equal(verified.status,200);assert.match(verified.cookie,/HttpOnly/);assert.match(verified.cookie,/SameSite=Lax/);
  assert.equal((await call('demo-auth/verify-otp',null,'POST',payload)).status,400);
  const headers={Cookie:verified.cookie.split(';')[0]};
  const session=await call('session',null,'GET',undefined,headers);
  assert.equal(session.body.user.email,email);assert.equal(session.body.user.authMode,'demo');assert.equal(session.body.user.role,'student');
  assert.equal((await call('admin/users',null,'GET',undefined,headers)).status,403);
  assert.equal((await call('admin/users/'+session.body.user.id,admin,'PATCH',{role:'admin'})).status,403);
  assert.equal((await call('demo-auth/request-otp',null,'POST',{email,purpose:'register',name:'Demo'})).status,409);
  assert.equal((await call('session',null,'GET',undefined,{Cookie:'ueh_demo_session='+'a'.repeat(64)})).body.user,null);
  assert.equal((await call('demo-auth/logout',null,'POST',undefined,headers)).status,200);
  assert.equal((await call('session',null,'GET',undefined,headers)).body.user,null);
  sqlite.prepare('UPDATE demo_otps SET sent_at=0 WHERE email=?').run(email);
  const login=await call('demo-auth/request-otp',null,'POST',{email,purpose:'login'});
  const loggedIn=await call('demo-auth/verify-otp',null,'POST',{challenge:login.body.challenge,code:login.body.demoCode});
  assert.equal(loggedIn.status,200);
  const cookie={Cookie:loggedIn.cookie.split(';')[0]};
  assert.equal((await call('session',null,'GET',undefined,cookie)).body.user.id,session.body.user.id);
  sqlite.prepare('UPDATE demo_sessions SET expires_at=0 WHERE user_id=?').run(session.body.user.id);
  assert.equal((await call('session',null,'GET',undefined,cookie)).body.user,null);
});

test('Demo OTP rejects expired, incorrect, replayed and superseded codes, and limits attempts', async () => {
  const email='otp-limits@st.ueh.edu.vn',request={email,purpose:'register',name:'OTP test'};
  const otp=await call('demo-auth/request-otp',null,'POST',request);
  const wrong=String((Number(otp.body.demoCode)+1)%1000000).padStart(6,'0');
  for(let i=0;i<5;i++)assert.equal((await call('demo-auth/verify-otp',null,'POST',{challenge:otp.body.challenge,code:wrong})).status,400);
  assert.equal((await call('demo-auth/verify-otp',null,'POST',{challenge:otp.body.challenge,code:otp.body.demoCode})).status,400);
  assert.equal(sqlite.prepare('SELECT * FROM demo_accounts WHERE email=?').get(email),undefined);
  sqlite.prepare('UPDATE demo_otps SET sent_at=0 WHERE email=?').run(email);
  const next=await call('demo-auth/request-otp',null,'POST',request);
  assert.equal((await call('demo-auth/verify-otp',null,'POST',{challenge:otp.body.challenge,code:otp.body.demoCode})).status,400);
  sqlite.prepare('UPDATE demo_otps SET expires_at=0 WHERE email=?').run(email);
  assert.equal((await call('demo-auth/verify-otp',null,'POST',{challenge:next.body.challenge,code:next.body.demoCode})).status,400);
  assert.equal((await call('demo-auth/request-otp',null,'POST',request,{Origin:'https://evil.example'})).status,403);
  assert.equal((await call('session',{userId:'unapproved-staff',email:'other@example.com',displayName:'Other'})).body.user,null);
});

