'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { GraduationCap, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { api } from './timtro';

type Mailbox = { challenge: string; email: string; demoCode: string; expiresAt: number; resendAt: number };
export function DemoAuth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(''), [name, setName] = useState(''), [code, setCode] = useState('');
  const [mailbox, setMailbox] = useState<Mailbox | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [time, setTime] = useState(Date.now()), [staffPending, setStaffPending] = useState(false);
  useEffect(() => { api('session').then(r => setStaffPending(Boolean(r.staffAccessPending))).catch(() => {}); }, []);
  useEffect(() => { if (!mailbox) return; const timer = setInterval(() => setTime(Date.now()), 1000); return () => clearInterval(timer); }, [mailbox]);
  const remaining = mailbox ? Math.max(0, Math.ceil((mailbox.expiresAt - time) / 1000)) : 0;
  const resendWait = mailbox ? Math.max(0, Math.ceil((mailbox.resendAt - time) / 1000)) : 0;
  async function requestCode(e?: FormEvent) {
    e?.preventDefault(); setError('');
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@st\.ueh\.edu\.vn$/.test(address)) { setError('Vui lòng dùng email có đúng đuôi @st.ueh.edu.vn.'); return; }
    setBusy(true);
    try {
      const result = await api('demo-auth/request-otp', 'POST', { email: address, purpose: mode, ...(mode === 'register' ? { name } : {}) });
      setMailbox(result as Mailbox); setTime(Date.now()); setCode('');
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function verify(e: FormEvent) {
    e.preventDefault(); if (!mailbox) return; setBusy(true); setError('');
    try { await api('demo-auth/verify-otp', 'POST', { challenge: mailbox.challenge, code }); window.location.assign('/account'); }
    catch (e) { setError((e as Error).message); setBusy(false); }
  }
  function reset(next = mode) { setMode(next); setMailbox(null); setCode(''); setError(''); }
  return <section className="auth-section">
    <div className="page-heading"><div><span className="kicker">TÀI KHOẢN SINH VIÊN UEH</span><h1>Một tài khoản, một hành trình tìm trọ</h1><p>Lưu phòng yêu thích, viết đánh giá và theo dõi yêu cầu liên hệ.</p></div></div>
    <div className="auth-demo-note"><ShieldCheck size={22} /><p><strong>Xác minh mô phỏng · Miễn phí</strong><br />Mã OTP hiển thị ngay trong Hộp thư demo. Không gửi email thật, không xác minh quyền sở hữu email. Chỉ dùng thông tin mẫu khi trải nghiệm.</p></div>
    <div className="auth-grid">
      <div className="panel auth-form-panel">
        {!mailbox ? <>
          <div className="auth-tabs" role="group" aria-label="Chọn đăng nhập hoặc đăng ký">
            <button className={mode === 'login' ? 'active' : ''} aria-pressed={mode === 'login'} onClick={() => reset('login')} disabled={busy}>Đăng nhập</button>
            <button className={mode === 'register' ? 'active' : ''} aria-pressed={mode === 'register'} onClick={() => reset('register')} disabled={busy}>Đăng ký</button>
          </div>
          <h2>{mode === 'register' ? 'Tạo tài khoản sinh viên' : 'Chào mừng bạn trở lại'}</h2>
          <p className="muted">Dùng email có đuôi @st.ueh.edu.vn để nhận mã mô phỏng.</p>
          <form onSubmit={requestCode}>
            {mode === 'register' && <label className="field"><span>Họ và tên</span><input autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} disabled={busy} placeholder="Nguyễn Văn An" /></label>}
            <label className="field"><span>Email sinh viên UEH</span><input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} disabled={busy} placeholder="312xxxxxxx@st.ueh.edu.vn" aria-describedby="auth-error" /></label>
            <button className="button primary full-width" disabled={busy}>{busy ? 'Đang tạo mã…' : 'Nhận mã OTP mô phỏng'}</button>
          </form>
        </> : <>
          <button className="text-button" disabled={busy} onClick={() => reset()}><ArrowLeft size={16} /> Đổi email / quay lại</button>
          <h2>Nhập mã xác minh</h2><p>Mã dành cho <strong className="auth-email">{mailbox.email}</strong></p>
          <form onSubmit={verify}>
            <label className="field"><span>Mã OTP 6 chữ số</span><input className="otp-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required autoFocus value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} disabled={busy} placeholder="000000" aria-describedby="auth-error" /></label>
            <p className="muted">{remaining ? `Mã hết hạn sau ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : 'Mã đã hết hạn. Hãy lấy mã mới.'}</p>
            <button className="button primary full-width" disabled={busy || !remaining || code.length !== 6}>{busy ? 'Đang xác minh…' : mode === 'register' ? 'Xác minh và tạo tài khoản' : 'Xác minh và đăng nhập'}</button>
          </form>
          <button className="text-button auth-resend" disabled={busy || resendWait > 0} onClick={() => requestCode()}>{resendWait > 0 ? `Gửi lại mã sau ${resendWait}s` : 'Gửi lại mã mô phỏng'}</button>
        </>}
        <p id="auth-error" role="alert" className="auth-error">{error}</p>
        <details className="auth-staff"><summary>Dành cho chủ trọ / quản trị</summary><p>Tài khoản được quản trị cấp quyền sử dụng lối đăng nhập riêng.</p><a className="text-button" href="/signin-with-chatgpt?return_to=%2Faccount" target="_top">Đăng nhập quản lý bằng ChatGPT</a>
          {staffPending && <p role="status">Tài khoản ChatGPT này chưa được cấp quyền quản lý. Sinh viên hãy dùng luồng OTP mô phỏng ở trên.</p>}
        </details>
      </div>
      <aside className="panel demo-mailbox" aria-label="Hộp thư demo">
        <div className="demo-mailbox-heading"><Mail size={24} /><div><h2>Hộp thư demo</h2><span>Chỉ hiển thị mã của lượt thao tác này</span></div></div>
        {mailbox ? <div className="demo-letter" aria-live="polite"><span className="badge blue">EMAIL MÔ PHỎNG</span><p><strong>Đến:</strong> <span className="auth-email">{mailbox.email}</span></p><h3>Mã xác minh Nhà trọ UEH</h3><p>Nhập mã bên dưới vào ô OTP để tiếp tục.</p><strong className="demo-otp" data-testid="demo-otp">{mailbox.demoCode}</strong><p>Mã dùng một lần, có hiệu lực trong 5 phút. Mã mới sẽ thay thế mã cũ.</p><small>Đây là hộp thư mô phỏng trên website; email thật của bạn không nhận thư.</small></div>
          : <div className="demo-mailbox-empty"><GraduationCap size={48} /><h3>Mã của bạn sẽ xuất hiện ở đây</h3><p>Chọn Đăng ký nếu chưa có tài khoản, nhập email UEH rồi bấm nhận mã.</p><span className="badge blue">Không cần dịch vụ gửi email</span></div>}
      </aside>
    </div>
  </section>;
}
