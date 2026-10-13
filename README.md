# TìmTrọ UEH

Website mô phỏng tìm trọ cho sinh viên, theo các ảnh `7.png`–`20.png` và cấu trúc thông tin của [Nhà trọ Online UEH](https://nhatroueh.com/).

## Tính năng

- Trang chủ xanh–trắng, responsive; dùng hình phòng từ ảnh tham chiếu qua CSS crop.
- Tìm phòng đơn/ở ghép theo trường, campus, khu vực, giá, khoảng cách, từ khóa, trạng thái còn phòng và số lớp xác thực; sắp xếp giá/khoảng cách/đánh giá.
- Chi tiết phòng, ảnh phóng to, tiện nghi, bảng chi phí tháng có thể tùy chỉnh điện/nước, tiền cọc riêng.
- Bản đồ OpenStreetMap, liên kết chỉ đường, trạng thái xác thực từng lớp, thư viện ảnh; hỗ trợ ảnh toàn cảnh kéo ngang và video MP4 khi được bổ sung.
- Sinh viên đăng ký/đăng nhập bằng email `@st.ueh.edu.vn` và OTP mô phỏng miễn phí; hồ sơ, yêu thích, đánh giá có duyệt, checklist, yêu cầu liên hệ và thông báo theo tài khoản. Chủ trọ/quản trị dùng đăng nhập ChatGPT riêng.
- Chủ trọ quản lý phòng được gán; quản trị quản lý phòng, ảnh, tài khoản, xác thực, đánh giá và phản hồi liên hệ.
- SQL/D1 lưu dữ liệu, R2 lưu ảnh/video tải lên; kiểm tra quyền phía server, truy vấn có tham số và kiểm tra dữ liệu bằng Zod.

## Dữ liệu mẫu và nguồn

Ứng dụng có 12 phòng mẫu. Ba phòng chính có giá/diện tích/trạng thái xác thực theo ảnh:

| Phòng | Tiền thuê | Diện tích | Tổng tháng mẫu | Xác thực |
| --- | --- | --- | --- | --- |
| DEMO-Q10-001 | 2.800.000đ | 20m² | 3.200.000đ | 3/3 |
| DEMO-Q10-002 | 3.200.000đ | 26m² | 3.570.000đ | 3/3 |
| DEMO-Q10-003 | 2.500.000đ | 28m² | 2.900.000đ | 2/3 |

Ảnh phòng 3 có bảng phí cộng thành 2.850.000đ nhưng tổng hiển thị 2.900.000đ. Dữ liệu mẫu điều chỉnh phí dịch vụ thành 150.000đ để tổng tính toán khớp 2.900.000đ. Chi phí đều hiển thị riêng và có thể sửa trong trang quản trị.

Đánh giá, chủ trọ, vị trí và xác thực là dữ liệu mô phỏng. Các nhận xét mẫu tạo lại từ tình huống trong ảnh; không phải lời xác nhận từ người thuê thật. Không có số liên hệ thật hoặc tài liệu CCCD. Ảnh 360°/video không được giả lập từ ảnh thường: chỉ hiển thị khi quản trị thêm tệp tương ứng. Gửi yêu cầu liên hệ chỉ lưu trong hệ thống; không gửi ra Zalo hay email. Link gọi điện/Zalo chỉ xuất hiện khi phòng có số điện thoại được cấu hình.

Nguồn cấu trúc và nội dung tham khảo: [Thông tin trọ](https://nhatroueh.com/thong-tin-tro/), [Hướng dẫn](https://nhatroueh.com/huong-dan/) và [Trang chủ](https://nhatroueh.com/). Các tọa độ/địa chỉ trong ứng dụng là vị trí tham khảo cho bản mô phỏng; khoảng cách mẫu không phải dữ liệu định tuyến giao thông.

## Chạy trên máy

Yêu cầu Node.js >=22.13.0; khuyến nghị Node 24. Git chỉ cần khi xuất bản bằng Sites. Không cần cài SQLite riêng.

```powershell
cd 'D:\nhà trọ ueh\timtro-ueh'
npm ci --include=dev --include=optional
Copy-Item .dev.vars.example .dev.vars
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_absent_lord_tyger.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_uneven_lyja.sql
npm run dev
```

Mở http://127.0.0.1:5173/. Áp dụng migration một lần với database mới; không chạy lại SQL đã áp dụng. Dữ liệu mẫu tự tạo khi API truy cập database lần đầu; local và production có database riêng.

Nếu shim `npm.cmd` trên Windows báo không tìm thấy `npm-prefix.js`, thay `npm` bằng entrypoint Node trực tiếp:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

Mở `/signin-with-chatgpt?return_to=/account` để dùng tài khoản local `seedy@sites.test`. Với `.dev.vars` như trên, tài khoản này có quyền quản trị. Mô phỏng danh tính ChatGPT chỉ chạy loopback trong dev; production dùng các header danh tính do Sites cung cấp cho quản trị/chủ trọ. OTP sinh viên mô phỏng là tính năng riêng, có trên cả local và demo public.

Ở production, cấu hình biến runtime `ADMIN_EMAIL` trong Sites cho email chủ sở hữu trước lần đăng nhập đầu tiên. Không đưa email cấu hình hay token vào mã nguồn. Tài khoản ChatGPT chưa được cấp vai trò quản lý không được dùng làm phiên sinh viên; quản trị có thể cấp vai trò chủ trọ/quản trị cho tài khoản ChatGPT trong `/manage`. Khi sửa phòng, quản trị gán tài khoản quản lý phòng để chủ trọ đó nhận yêu cầu và có quyền chỉnh sửa. Tài khoản OTP demo luôn chỉ có quyền sinh viên và bị backend chặn cấp quyền quản lý.

## Đăng ký / đăng nhập OTP mô phỏng

Mở `/account`, chọn **Đăng ký**, nhập tên mẫu và email dạng `312demo@st.ueh.edu.vn`. Nhấn **Nhận mã OTP mô phỏng**, lấy mã từ **Hộp thư demo** trên trang và nhập để tạo tài khoản. Các lần sau chọn **Đăng nhập** với cùng email và lấy mã mới. Không cần mật khẩu, Resend, API key, tên miền hoặc dịch vụ email trả phí.

Không có email thật được gửi. Email chỉ được kiểm tra đúng định dạng/tên miền, không xác minh quyền sở hữu email hay tư cách sinh viên thật. Vì mã hiển thị trên trang, bất kỳ người trải nghiệm nào cũng có thể đăng nhập tài khoản demo của một email đã biết: chỉ dùng dữ liệu mẫu, không nhập thông tin riêng tư. Tài khoản demo tách khỏi danh tính ChatGPT và không thể đăng nhập hay nâng quyền thành chủ trọ/quản trị bằng OTP.

Backend lưu mã dạng băm, chỉ cho dùng một lần trong 5 phút, chờ 60 giây giữa các lần gửi, khóa mã sau 5 lần nhập sai. Gửi lại sẽ thay thế mã cũ. Phiên demo lưu ở D1 và cookie HttpOnly/SameSite=Lax (Secure trên HTTPS), hết hạn sau 7 ngày hoặc bị thu hồi khi đăng xuất. Hộp thư demo chỉ giữ mã của lượt thao tác hiện tại trong bộ nhớ trang; tải lại trước khi xác minh cần yêu cầu mã mới sau thời gian chờ.

API: `POST /api/demo-auth/request-otp` nhận `{email,purpose:"register"|"login",name?}`; `POST /api/demo-auth/verify-otp` nhận `{challenge,code}`; `POST /api/demo-auth/logout` thu hồi phiên. `/api/session` trả `authMode: "demo"` trong hồ sơ của phiên mô phỏng.

## Kiểm tra

```powershell
npm run typecheck
npm test
npm run build
# Khi dev server đang chạy và máy có Google Chrome:
npm run test:browser
node scripts/test-demo-auth-browser.mjs
```

`npm test` chạy backend thật với một adapter SQLite trong bộ nhớ: lọc/sắp xếp, chi phí, danh tính, dữ liệu riêng, CSRF, quyền quản trị/chủ trọ, CRUD phòng, bản nháp, kiểm duyệt đánh giá, phản hồi và thông báo; thêm kiểm tra OTP đúng đuôi UEH, hết hạn, dùng lại, giới hạn nhập sai/gửi lại, phiên đăng nhập và chặn nâng quyền demo. Không thay đổi database ứng dụng.

`test:browser` chạy Playwright với Google Chrome tại `C:/Program Files/Google/Chrome/Application/chrome.exe`. Điều chỉnh `executablePath` nếu máy dùng vị trí khác. Kiểm tra này dùng database local và có thể tạo yêu cầu/phản hồi thử. Kết quả và screenshot nằm trong `outputs/` (không commit).

`test-demo-auth-browser.mjs` kiểm tra đăng ký/đăng nhập OTP, email sai đuôi, mã sai, mobile, giữ phiên, yêu thích và đăng xuất. Mặc định chạy local; có thể đặt `TEST_BASE_URL` để kiểm tra bản đã triển khai. Bài kiểm tra tạo một tài khoản mẫu và đợi đủ cooldown 60 giây trước khi đăng nhập lại.

## Cấu trúc mã nguồn

- `components/timtro.tsx`: giao diện và các luồng sinh viên.
- `components/management.tsx`: quản lý phòng, tệp, người dùng và duyệt/phản hồi.
- `app/globals.css`: desktop/mobile và hiệu ứng.
- `app/api/[...path]/route.ts`: kết nối danh tính Sites, D1/R2 với API.
- `lib/server.ts`: validation, quyền truy cập và thao tác dữ liệu.
- `lib/types.ts`, `lib/seed.ts`: kiểu dữ liệu, campus, công thức chi phí, fixtures.
- `db/schema.ts`, `drizzle/`: schema và migration.
- `.openai/hosting.json`: Site ID và binding `DB`/`BUCKET`.

## API chính

| Endpoint | Chức năng |
| --- | --- |
| GET `/api/health` | Kiểm tra database/API |
| GET `/api/session` | Danh tính và vai trò hiện tại |
| PATCH `/api/profile` | Cập nhật hồ sơ của mình |
| GET/POST `/api/rooms` | Tìm phòng / tạo phòng theo quyền |
| GET/PATCH/DELETE `/api/rooms/:id` | Xem / sửa / chuyển phòng thành bản nháp |
| GET/POST `/api/rooms/:id/reviews` | Đánh giá đã đăng / gửi đánh giá chờ duyệt |
| POST/DELETE `/api/favorites/:roomId` | Lưu / bỏ lưu phòng |
| GET/POST `/api/inquiries` | Yêu cầu riêng / gửi yêu cầu |
| PATCH `/api/inquiries/:id` | Chủ trọ có quyền hoặc admin phản hồi |
| GET/PATCH `/api/notifications` | Thông báo riêng / đánh dấu đã đọc |
| GET/PATCH `/api/admin/users/:id` | Danh sách ở `/users`; sửa vai trò ở `/users/:id` |
| GET/PATCH `/api/admin/reviews/:id` | Chờ duyệt ở `/reviews`; duyệt ở `/reviews/:id` |
| POST `/api/uploads` | Multipart `file`: JPG/PNG/WebP/MP4, tối đa 8MB |

Khi đổi schema, chạy `npm run db:generate`, kiểm tra migration mới rồi áp dụng local. Sites áp dụng migration production khi deploy. Giữ nguyên migration đã áp dụng. Không commit `.dev.vars`, `.wrangler`, `.sites-runtime`, token hay dữ liệu runtime.

## Build trên GitHub Actions và GitHub Pages

Workflow `.github/workflows/nextjs.yml` dùng Node 24, `npm ci`, kiểm tra TypeScript/backend và `npm run build` (Vinext). Bản build Worker đầy đủ được lưu thành artifact `timtroueh-worker-build`.

GitHub Pages chỉ xuất bản trang chuyển hướng trong `pages/index.html` tới demo public https://timtro-ueh-sinhvien.abuzzbetta32.chatgpt.site/. Backend và database vẫn chạy tại demo Sites. Không dùng mẫu `npx next build` hoặc chèn `static_site_generator: next` vào bước kiểm tra/build ứng dụng này.

Workflow chạy khi thay đổi mã nguồn trên `main` hoặc bấm **Run workflow**. Các commit chỉ cập nhật `plan.md`/README không kích hoạt lại quá trình build. Khi cần xem lỗi hoặc tải artifact, mở tab **Actions** của repo.

## Giao diện tân sinh viên UEH — 13/10/2026

- Logo UEH lấy nguyên bản từ https://hotro.ueh.edu.vn/images/logo-ueh.png?t=12321; giữ màu/tỷ lệ, đặt trên nền xanh cổ vịt.
- Màu theo trang https://nhatroueh.com/thong-tin-tro/: xanh nhạt `#80A6F2`, xanh ngọc `#7EDDF2`, nền `#F8F5F4`. Montserrat cho tiêu đề và Be Vietnam Pro cho nội dung. Chi tiết trong `design-system/student-housing.md`.
- Trang chủ có tìm nhanh theo cơ sở/ngân sách/loại phòng; thẻ phòng hiển thị tổng chi phí dự kiến. Bộ lọc được giữ trong query của `/search` để tải lại/chia sẻ đường dẫn.
- Mobile có điều hướng dưới, bộ lọc thu gọn, bảng phí ngay sau ảnh; chi tiết có checklist xem trọ. Giữ OTP mô phỏng và backend hiện có.
- Bỏ dòng thông báo học tập tại chân trang theo yêu cầu; phần OTP và trạng thái dữ liệu mẫu vẫn ghi đúng chức năng.
- Hướng dẫn UI/UX tham khảo từ https://github.com/nextlevelbuilder/ui-ux-pro-max-skill; áp dụng trực tiếp tài liệu vì không có Python chạy được, không cài thêm phần mềm.
- Chạy kiểm tra giao diện bằng `node scripts/test-student-design.mjs` khi preview local đang chạy.
