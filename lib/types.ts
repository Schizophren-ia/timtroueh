export type Role = 'student' | 'landlord' | 'admin';
export type Profile = { id: string; email: string; name: string; phone: string; university: string; campus: string; role: Role; authMode?: 'demo' };
export type Room = {
  id: string; code: string; title: string; price: number; type: 'single' | 'shared'; district: string;
  status: 'available' | 'full' | 'draft'; ownerId: string | null; area: number; capacity: number;
  floor: string; address: string; university: string; distances: Record<string, number>;
  latitude: number; longitude: number; images: string[]; amenities: string[];
  electricityRate: number; electricityUsage: number; waterRate: number; waterUsage: number;
  wifi: number; service: number; parking: number; deposit: number;
  verifiedPeople: boolean; verifiedInfo: boolean; verifiedMedia: boolean; verifiedAt: string;
  landlordName: string; contactPhone: string; description: string; sourceURL: string;
  panoramaURL: string; videoURL: string; rating?: number; reviewCount?: number; favorite?: boolean;
};
export type Review = { id: string; room_id: string; user_id: string | null; name: string; category: string; rating: number; landlord_score: number; room_score: number; info_score: number; body: string; status: string; checklist: string; created_at: string };
export const campuses = [
  { id: 'B', name: 'Cơ sở B · 279 Nguyễn Tri Phương', university: 'UEH', lat: 10.7607, lng: 106.6673 },
  { id: 'A', name: 'Cơ sở A · 59C Nguyễn Đình Chiểu', university: 'UEH', lat: 10.7829, lng: 106.6933 },
  { id: 'N', name: 'Cơ sở Nguyễn Văn Linh · Bình Chánh', university: 'UEH', lat: 10.7296, lng: 106.6357 },
  { id: 'HCMUT', name: 'ĐH Bách khoa · Lý Thường Kiệt', university: 'HCMUT', lat: 10.7734, lng: 106.6591 },
  { id: 'HCMUS', name: 'ĐH Khoa học Tự nhiên · Nguyễn Văn Cừ', university: 'HCMUS', lat: 10.7624, lng: 106.6822 },
];
export const universityNames: Record<string, string> = { UEH: 'Đại học Kinh tế TP.HCM (UEH)', HCMUT: 'Đại học Bách khoa TP.HCM', HCMUS: 'Đại học Khoa học Tự nhiên TP.HCM' };
export const checklistLabels = ['Sạch sẽ', 'Đúng mô tả', 'An ninh tốt', 'Không chung chủ', 'Wifi ổn định', 'Đủ nội thất cơ bản'];
export const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
export const verificationCount = (r: Room) => Number(r.verifiedPeople) + Number(r.verifiedInfo) + Number(r.verifiedMedia);
export const monthlyCost = (r: Room, electricity = r.electricityUsage, water = r.waterUsage) => r.price + r.electricityRate * electricity + r.waterRate * water + r.wifi + r.service + r.parking;
