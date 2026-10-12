import type { Room } from './types';
import { checklistLabels, campuses } from './types';
const base: Omit<Room, 'id' | 'code' | 'title' | 'price' | 'area' | 'distances'> = {
  type: 'single', district: 'Quận 10', status: 'available', ownerId: null, capacity: 1,
  floor: 'Tầng 3 · Thang bộ', address: 'Khu vực Nguyễn Tri Phương, phường Diên Hồng, TP.HCM (vị trí mô phỏng)',
  university: 'UEH', latitude: 10.767, longitude: 106.667, images: ['/assets/room-1.png'],
  amenities: ['Giường', 'Tủ đồ', 'Máy lạnh', 'Wifi', 'Máy giặt chung', 'Bếp chung'],
  electricityRate: 4000, electricityUsage: 25, waterRate: 50000, waterUsage: 1,
  wifi: 100000, service: 150000, parking: 0, deposit: 2800000,
  verifiedPeople: true, verifiedInfo: true, verifiedMedia: true, verifiedAt: '2026-10-06',
  landlordName: 'Nguyễn Thị Hằng (mẫu)', contactPhone: '',
  description: 'Phòng dành cho sinh viên, có cửa sổ và góc học tập. Giờ giấc tự do, không chung chủ. Giá và thông số mô phỏng theo ảnh tham chiếu; hãy kiểm tra trực tiếp trước khi thuê.',
  sourceURL: 'https://nhatroueh.com/thong-tin-tro/', panoramaURL: '', videoURL: '',
};
function distances(lat: number, lng: number) {
  return Object.fromEntries(campuses.map(c => {
    const rad = Math.PI / 180, dlat = (lat - c.lat) * rad, dlng = (lng - c.lng) * rad;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(c.lat * rad) * Math.cos(lat * rad) * Math.sin(dlng / 2) ** 2;
    return [c.id, Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10];
  }));
}
export const seedRooms: Room[] = [
  { ...base, id: 'room-1', code: 'DEMO-Q10-001', title: 'Phòng trọ 1 người – Quận 10', price: 2800000, area: 20, distances: { B: 1, A: 4.1, N: 5.8, HCMUT: 1.4, HCMUS: 2.2 } },
  { ...base, id: 'room-2', code: 'DEMO-Q10-002', title: 'Phòng sáng thoáng, đủ nội thất – Quận 10', price: 3200000, area: 26, floor: 'Tầng 6 · Thang máy', distances: { B: 1.5, A: 4.5, N: 6.1, HCMUT: 0.8, HCMUS: 2.6 }, latitude: 10.773, longitude: 106.666, images: ['/assets/room-2.png'], electricityUsage: 30, waterRate: 80000, wifi: 70000, service: 100000, deposit: 3200000, landlordName: 'Hồ Ngọc Hà (mẫu)', verifiedAt: '2026-09-28' },
  { ...base, id: 'room-3', code: 'DEMO-Q10-003', title: 'Phòng có ban công, góc học tập – Quận 10', price: 2500000, area: 28, floor: 'Tầng 5 · Thang máy', distances: { B: 1.8, A: 4.8, N: 6.3, HCMUT: 1.2, HCMUS: 3 }, latitude: 10.775, longitude: 106.671, images: ['/assets/room-3.png'], electricityUsage: 30, waterRate: 50000, wifi: 80000, service: 150000, deposit: 2500000, verifiedPeople: false, landlordName: 'Trường Giang (mẫu)', verifiedAt: '2026-07-30' },
  ...[
    ['Phòng ở ghép nữ gần UEH cơ sở B', 'shared', 'Quận 10', 1200000, 30, 10.758, 106.663, 'room-1'],
    ['Phòng gác lửng, bếp riêng – Hòa Bình', 'single', 'Quận 11', 2300000, 24, 10.763, 106.646, 'room-3'],
    ['Ở ghép 2 người, đầy đủ tiện nghi', 'shared', 'Quận 11', 2000000, 32, 10.770, 106.644, 'room-2'],
    ['Studio yên tĩnh, gần cơ sở A', 'single', 'Quận 3', 4400000, 28, 10.783, 106.688, 'room-1'],
    ['Phòng sinh viên gần cơ sở Nguyễn Văn Linh', 'single', 'Bình Chánh', 2700000, 25, 10.727, 106.640, 'room-3'],
    ['Phòng cửa sổ lớn – Tân Bình', 'single', 'Tân Bình', 3500000, 30, 10.795, 106.654, 'room-2'],
    ['Ở ghép nam, gần Đại học Bách khoa', 'shared', 'Quận 10', 1800000, 28, 10.777, 106.657, 'room-1'],
    ['Phòng tiện nghi gần Nguyễn Văn Cừ', 'single', 'Quận 5', 3000000, 22, 10.756, 106.683, 'room-3'],
    ['Phòng có bếp, chỗ để xe riêng', 'single', 'Quận 11', 3400000, 26, 10.770, 106.651, 'room-2'],
  ].map((v, i) => ({ ...base, id: `room-${i + 4}`, code: `DEMO-${String(i + 4).padStart(3, '0')}`, title: String(v[0]), type: v[1] as Room['type'], district: String(v[2]), price: Number(v[3]), area: Number(v[4]), latitude: Number(v[5]), longitude: Number(v[6]), distances: distances(Number(v[5]), Number(v[6])), address: `Khu vực ${v[2]}, TP.HCM (vị trí mô phỏng)`, images: [`/assets/${v[7]}.png`], capacity: v[1] === 'shared' ? 2 : 1, deposit: Number(v[3]), verifiedPeople: i % 3 !== 1, service: 100000, wifi: 80000 })),
];
const names = ['Nguyễn Thị Mai', 'Lê Minh Anh', 'Trần Quốc Bảo', 'Hà Thị Thu', 'Lê Bảo Ngọc', 'Trần Văn Khải', 'Nguyễn Thị Ngọc Ánh', 'Lê Gia Hân', 'Trần Hữu Văn'];
const bodies = ['Phòng giống hình, sạch sẽ, chủ trọ nhiệt tình. Góc học tập thoải mái.', 'Vị trí thuận tiện, gần nhiều tiện ích. Phòng hơi nóng vào buổi trưa.', 'An ninh tốt, wifi ổn định. Có chút tiếng ồn vào buổi tối.', 'Chi phí rõ ràng, nội thất cơ bản đầy đủ. Chủ trọ hỗ trợ nhanh.', 'Phòng thoáng mát, có chỗ để xe. Nên hỏi kỹ phí dịch vụ trước khi thuê.'];
export async function seedDatabase(db: D1Database) {
  if (await db.prepare("SELECT id FROM rooms WHERE id = 'room-1'").first()) return;
  const statements: D1PreparedStatement[] = [];
  for (const r of seedRooms) {
    statements.push(db.prepare('INSERT OR IGNORE INTO rooms (id,code,title,price,type,district,status,owner_id,data,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(r.id, r.code, r.title, r.price, r.type, r.district, r.status, r.ownerId, JSON.stringify(r), '2026-10-12T00:00:00.000Z'));
    const count = r.id === 'room-1' ? 32 : r.id === 'room-2' ? 18 : r.id === 'room-3' ? 25 : 3;
    const fiveCount = count === 32 ? 26 : count === 18 ? 13 : count === 25 ? 18 : 2;
    for (let i = 0; i < count; i++) {
      const rating = i < fiveCount ? 5 : 4;
      const category = i < Math.ceil(count * 0.63) ? 'room' : i < Math.ceil(count * 0.88) ? 'landlord' : 'other';
      statements.push(db.prepare('INSERT OR IGNORE INTO reviews (id,room_id,user_id,name,category,rating,landlord_score,room_score,info_score,body,status,checklist,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(`seed-${r.id}-${i}`, r.id, null, names[i % names.length] + (i >= names.length ? ` ${i + 1}` : ''), category, rating, rating, rating, rating, bodies[i % bodies.length], 'published', JSON.stringify(checklistLabels.slice(0, i % 4 === 1 ? 4 : 6)), `2026-09-${String(28 - (i % 26)).padStart(2, '0')}T00:00:00.000Z`));
    }
  }
  await db.batch(statements);
}
