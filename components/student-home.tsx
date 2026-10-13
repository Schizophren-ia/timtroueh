'use client';
import { ArrowRight, ArrowUpRight, MapPin, GraduationCap, Wallet, Heart, Check, Compass, BookOpen, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Photo } from './timtro';

type Props = { search: ReactNode; rooms: ReactNode; navigate: (path: string) => void; quickSearch: (campus: string) => void };
export function StudentHome({ search, rooms, navigate, quickSearch }: Props) {
  return <main id="main-content">
    <section className="welcome-section">
      <div className="container welcome-grid">
        <div className="welcome-copy">
          <span className="welcome-label"><GraduationCap size={18} /> CHÀO TÂN SINH VIÊN UEH</span>
          <h1>Một nơi ở mới.<br /><span>Một khởi đầu đẹp.</span></h1>
          <p>Chuyện tìm trọ đầu tiên, để chúng mình đồng hành.<br className="desktop-break" /> Tìm căn phòng vừa túi tiền, gần trường và hợp với bạn.</p>
          <div className="welcome-actions"><a className="button primary" href="#tim-phong">Bắt đầu tìm phòng <ArrowRight size={18} /></a><a className="welcome-guide" href="#cam-nang"><BookOpen size={19} /> Lần đầu thuê trọ?</a></div>
          <div className="welcome-points"><span><Check size={16} /> Gần cơ sở học</span><span><Check size={16} /> Rõ từng khoản phí</span><span><Check size={16} /> Dễ dàng lưu phòng</span></div>
        </div>
        <div className="welcome-visual">
          <div className="welcome-photo"><Photo src="/assets/room-1.png" label="Không gian phòng trọ dành cho sinh viên" /><div className="photo-caption"><span>MỘT GÓC NHỎ CHO HÀNH TRÌNH LỚN</span><strong>Ở gần trường. Sống gần ước mơ.</strong></div></div>
          <div className="welcome-sticker"><GraduationCap size={25} /><span>Xin chào,<strong>UEHer!</strong></span></div>
          <div className="welcome-location"><span className="location-icon"><MapPin size={22} /></span><div><strong>Ưu tiên gần giảng đường</strong><span>Chọn cơ sở học, tìm nơi ở phù hợp</span></div></div>
          <Sparkles className="visual-spark" aria-hidden="true" />
        </div>
      </div>
    </section>
    <section className="container student-search" id="tim-phong" aria-label="Tìm phòng nhanh">{search}<div className="quick-campus"><span>Tìm nhanh gần:</span>{[['B', 'Cơ sở B · Nguyễn Tri Phương'], ['A', 'Cơ sở A · Nguyễn Đình Chiểu'], ['N', 'Cơ sở Nguyễn Văn Linh']].map(([id, label]) => <button key={id} onClick={() => quickSearch(id)}><MapPin size={14} />{label}<ArrowUpRight size={14} /></button>)}</div></section>
    <section className="container room-discovery"><div className="section-title"><div><span className="kicker">BẮT ĐẦU TỪ MỘT CĂN PHÒNG PHÙ HỢP</span><h2>Một vài căn phòng dành cho bạn</h2><p>Gần cơ sở B, giá thuê từ 2 đến 3,5 triệu đồng/tháng.</p></div><button className="button outline" onClick={() => navigate('/search')}>Xem tất cả phòng <ArrowRight size={17} /></button></div>{rooms}</section>
    <section className="container student-compass"><div className="compass-intro"><span className="kicker">TÌM TRỌ CÙNG BẠN</span><h2>Lần đầu xa nhà,<br />vẫn có thể an tâm.</h2><p>Một lựa chọn tốt bắt đầu từ những điều thật rõ ràng.</p><a className="text-button" href="#cam-nang">Cẩm nang cho tân sinh viên <ArrowRight size={17} /></a></div><div className="compass-items">{[[MapPin,'Gần trường, tiện đi lại','Xem khoảng cách đến từng cơ sở UEH và vị trí phòng trước khi hẹn xem.'],[Wallet,'Biết rõ ngân sách','Tính cả tiền điện, nước, wifi và gửi xe để chủ động chi tiêu mỗi tháng.'],[Heart,'Chọn căn phòng hợp mình','Lưu phòng yêu thích, đọc đánh giá và đối chiếu tiện nghi trước khi quyết định.']].map(([Icon,title,description],i)=>{const I=Icon as typeof MapPin;return <article key={i}><span className="compass-icon"><I size={25} /></span><div><h3>{title as string}</h3><p>{description as string}</p></div></article>;})}</div></section>
    <section className="container newcomer-guide" id="cam-nang"><div className="section-title"><div><span className="kicker">BỎ TÚI TRƯỚC KHI THUÊ</span><h2>Đi tìm trọ, bắt đầu từ đâu?</h2><p>Ba bước nhỏ để bạn tự tin hơn với lựa chọn đầu tiên.</p></div><a className="text-button" href="https://nhatroueh.com/huong-dan/" target="_blank" rel="noreferrer">Đọc thêm hướng dẫn <ArrowUpRight size={18} /></a></div><div className="guide-grid">{[[Compass,'01','Chọn khu vực & ngân sách','Bắt đầu từ cơ sở học. Dự trù cả tiền thuê, phí sinh hoạt và khoản cọc ban đầu.'],[SlidersHorizontal,'02','Xem phòng & đối chiếu','Đến tận nơi để kiểm tra ánh sáng, nội thất, lối đi, an ninh và các khoản phí.'],[BookOpen,'03','Đọc kỹ trước khi ký','Hỏi rõ thời hạn thuê, điều kiện hoàn cọc, giá điện nước và nội quy sinh hoạt.']].map(([Icon,n,title,description],i)=>{const I=Icon as typeof BookOpen;return <article key={i}><div><I size={26} /><span>{n as string}</span></div><h3>{title as string}</h3><p>{description as string}</p></article>;})}</div></section>
  </main>;
}

export function ViewingChecklist() {
  const items = ['Kiểm tra khóa cửa và lối thoát hiểm', 'Thử vòi nước, ổ điện và wifi', 'Hỏi đủ tiền thuê, cọc và các loại phí', 'Đọc điều kiện trả cọc trong hợp đồng'];
  const [checked, setChecked] = useState<string[]>([]);
  return <section className="panel viewing-checklist"><span className="kicker">MANG THEO KHI ĐI XEM PHÒNG</span><h2>Checklist nhỏ, an tâm hơn</h2><p>Đánh dấu những điều bạn đã kiểm tra tại phòng.</p><div>{items.map(item => <label className="checkbox" key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e => setChecked(current => e.target.checked ? [...current,item] : current.filter(v => v !== item))} />{item}</label>)}</div><span className="checklist-progress" role="status">Đã kiểm tra {checked.length}/{items.length} mục</span></section>;
}
