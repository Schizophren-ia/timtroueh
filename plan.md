# Kế hoạch TìmTrọ UEH

Cập nhật: 12/10/2026.

## Workflow của người dùng

1. Người dùng nêu công việc.
2. Trình bày hướng và ý tưởng.
3. Người dùng duyệt.
4. Triển khai phạm vi đã duyệt.
5. Cập nhật kết quả thực hiện và kiểm tra vào file này.

**Trạng thái hiện tại: Website và backend đã hoàn thành, demo đã live; mã nguồn đã đưa lên GitHub riêng tư.**
Người dùng xác nhận "Duyệt" ngày 12/10/2026. Mã nguồn nằm trong `timtro-ueh/`. Local đã được kiểm tra tại http://127.0.0.1:5173/; server test đã dừng sau bàn giao, có thể chạy lại theo README. Sites có bản live version 1 tại https://timtro-ueh-sinhvien.abuzzbetta32.chatgpt.site.

## Mục tiêu

Xây dựng website mô phỏng tìm trọ cho sinh viên có frontend và backend, kết hợp giao diện trong ảnh với nội dung và cấu trúc thông tin của https://nhatroueh.com/.

## Kết quả khảo sát

- Workspace: `D:\nhà trọ ueh`.
- Đã kiểm tra toàn bộ 14 ảnh từ `7.png` đến `20.png`.
- Thư mục hiện chưa có mã nguồn ứng dụng, package.json hay cấu hình hosting.
- Website gốc truy cập trực tiếp bị timeout khi khảo sát; kết quả lập chỉ mục cung cấp nội dung trang chủ, thông tin trọ và hướng dẫn.
- Trang thông tin trọ: https://nhatroueh.com/thong-tin-tro/ — cấu trúc gồm mã phòng, khu vực, giá thuê, khoảng cách cơ sở B, đối tượng thuê, giá điện, nước và phí dịch vụ.
- Trang hướng dẫn: https://nhatroueh.com/huong-dan/ — tìm/lọc phòng, xem chi tiết và hình ảnh, sử dụng mã phòng để yêu cầu tư vấn.
- Trang chủ: https://nhatroueh.com/ — giới thiệu hoạt động hỗ trợ sinh viên và tư vấn trọ.

### Đối chiếu ảnh

| Ảnh | Nội dung cần tái hiện |
| --- | --- |
| 7.png | Trang tìm trọ: phòng đơn/ở ghép, campus, trường, giá thuê và khoảng cách |
| 8.png | Kết quả tìm kiếm, thông tin bộ lọc, sắp xếp, yêu thích, đánh giá và bản đồ |
| 9.png | Phòng mẫu 1: 2.800.000đ, 20m²; thư viện ảnh, tổng chi phí 3.200.000đ, tiện nghi, xác thực 3/3 |
| 10.png | Chi tiết ba lớp xác thực: người thuê, địa điểm/thông tin, hình ảnh/video |
| 11.png | Đánh giá phòng mẫu 1 và checklist |
| 12.png | Chủ trọ mẫu 1, thông tin liên hệ và biểu mẫu tin nhắn |
| 13.png | Đánh giá phòng mẫu 2 và checklist |
| 14.png | Đánh giá phòng mẫu 3 và checklist |
| 15.png | Chủ trọ mẫu 2 và biểu mẫu tin nhắn |
| 16.png | Chủ trọ mẫu 3 và biểu mẫu tin nhắn |
| 17.png | Phòng mẫu 2: 3.200.000đ, 26m²; tổng chi phí 3.570.000đ, xác thực 3/3 |
| 18.png | Phòng mẫu 3: 2.500.000đ, 28m²; tổng chi phí 2.900.000đ, xác thực 2/3 |
| 19.png | Ba lớp xác thực của phòng mẫu 2 |
| 20.png | Hai lớp đã xác thực, lớp người thuê chưa xác thực của phòng mẫu 3 |

## Phương án đã trình bày, chờ duyệt

- Tên ứng dụng: TìmTrọ UEH; giao diện xanh–trắng theo ảnh, responsive cho điện thoại và máy tính.
- React/TypeScript và Vinext cho giao diện và API phía server; cơ sở dữ liệu SQL lưu dữ liệu lâu dài.
- Tìm kiếm và lọc theo loại phòng, trường, campus, giá thuê, khoảng cách và khu vực; sắp xếp kết quả.
- Chi tiết phòng với thư viện ảnh, tiện nghi, bản đồ và bảng chi phí; cho phép điều chỉnh mức sử dụng để ước tính tổng chi phí.
- Hiển thị từng lớp xác thực, đánh giá và checklist theo ảnh.
- Tài khoản: đăng nhập, hồ sơ, phòng yêu thích, yêu cầu liên hệ và thông báo.
- Phân quyền sinh viên, chủ trọ và quản trị viên.
- Quản trị: thêm/sửa phòng và ảnh, cập nhật trạng thái còn phòng, duyệt đánh giá và cập nhật xác thực.
- Ba phòng mẫu theo ảnh, bổ sung dữ liệu mô phỏng theo cấu trúc thông tin website gốc.
- Ghi rõ thông tin liên hệ, đánh giá và xác thực mô phỏng; không trình bày dữ liệu mẫu như thông tin đã kiểm chứng thực tế.
- Yêu cầu liên hệ lưu trong hệ thống. Gửi tin Zalo thực tế cần tích hợp riêng, không thuộc phần mô phỏng đã đề xuất.
- Bàn giao mã nguồn, hướng dẫn chạy, kết quả kiểm tra và bản demo riêng tư.

## Tiến độ

- [x] Kiểm tra workspace và các tài liệu tham chiếu.
- [x] Xem toàn bộ ảnh frontend.
- [x] Khảo sát nội dung website gốc qua kết quả lập chỉ mục.
- [x] Trình bày hướng và phạm vi đề xuất cho người dùng.
- [x] Người dùng duyệt phương án.
- [x] Khởi tạo ứng dụng và cơ sở dữ liệu.
- [x] Triển khai giao diện và các luồng trong ảnh.
- [x] Triển khai API, đăng nhập và phân quyền.
- [x] Triển khai quản trị và dữ liệu mẫu.
- [x] Kiểm tra tìm kiếm, chi phí, yêu thích, đánh giá, liên hệ và quyền truy cập.
- [x] Kiểm tra giao diện responsive và bản build.
- [x] Xuất bản demo riêng tư, bàn giao và cập nhật kết quả.

## Kiểm tra và bàn giao

### Kết quả thực hiện

- React/TypeScript + Vinext; API phía server và D1/SQLite gồm 6 bảng: profiles, rooms, favorites, reviews, inquiries, notifications.
- Đã tạo migration SQL/Drizzle và áp dụng thành công vào D1 local.
- Có 12 phòng mẫu; ba phòng chính giữ tiền thuê, diện tích và số lớp xác thực theo ảnh. Các nhận xét mẫu có số lượng 32, 18 và 25 tương ứng.
- Giao diện trang chủ, bộ lọc, kết quả, chi tiết, ước tính chi phí, ảnh phóng to, bản đồ, xác thực, đánh giá/checklist, chủ trọ/liên hệ, hồ sơ, yêu thích, thông báo và quản trị đã nối API.
- ChatGPT sign-in dùng danh tính do Sites cung cấp; dev loopback có mock auth. Quyền sinh viên/chủ trọ/quản trị được kiểm tra ở backend.
- Trang quản trị thêm/sửa phòng, trạng thái còn phòng/bản nháp, ảnh, phí, vị trí, chủ trọ, xác thực; có duyệt đánh giá, phản hồi yêu cầu và cấp vai trò/gán chủ trọ.
- R2 lưu ảnh/video tải lên; API kiểm tra loại tệp, chữ ký định dạng và giới hạn 8MB. Ảnh 360°/video chỉ hiển thị khi được bổ sung.
- README đã có hướng dẫn chạy Windows, database local, đăng nhập, API và các lệnh kiểm tra.
- Yêu cầu liên hệ lưu trong hệ thống; không gửi ra Zalo/email. Số điện thoại thật chưa được cung cấp.
- Ảnh phòng 3 có tổng hiển thị 2.900.000đ nhưng bảng phí cộng thành 2.850.000đ. Mẫu điều chỉnh phí dịch vụ thành 150.000đ để công thức và tổng hiển thị nhất quán; README ghi rõ khác biệt.

### Bằng chứng kiểm tra

- `node node_modules/typescript/bin/tsc --noEmit`: thành công.
- Build qua Sites `build-site.mjs`: thành công; có route giao diện, API và phục vụ tệp tải lên.
- `node scripts/prepare-tests.mjs` + `node --test scripts/test-api.mjs`: 5/5 bài kiểm tra qua, bao gồm bộ lọc/campus/sắp xếp/chi phí, danh tính và dữ liệu riêng, chống yêu cầu khác origin, CRUD và bản nháp, quyền chủ trọ, kiểm duyệt, liên hệ/phản hồi/thông báo.
- API thật trên server local trả HTTP 200 và dữ liệu D1.
- Kiểm tra Chrome/Playwright: trang chủ và kết quả có 3 phòng chính; xem chi tiết và đổi chi phí; phân biệt xác thực 3/3 và 2/3; xem thêm đánh giá; đăng nhập quản trị; lưu/bỏ yêu thích; gửi liên hệ và phản hồi trong quản trị.
- `outputs/browser-report.json`: không có lỗi JavaScript; trang chủ ở viewport 390px không tràn ngang. Đã lưu screenshot desktop/mobile trong `timtro-ueh/outputs/`.
- `outputs/browser-extra-report.json`: tạo/sửa phòng qua giao diện, tải/đọc ảnh từ R2 local, duyệt đánh giá qua giao diện đều đã qua; 9 route ở viewport 390px không tràn ngang, không có lỗi JavaScript.
- Backend trên demo đã xuất bản cũng được kiểm tra trực tiếp: `/api/health` trả 200 và database D1; `/api/rooms` với bộ lọc 3 phòng chính trả 200, tổng 3 phòng. Dùng quyền truy cập riêng tư của Sites trong bộ nhớ; không đưa token vào log hoặc mã nguồn.

### Đóng gói và xuất bản

- Site ID: `appgprj_6acbc3cb8f808191ad1bff0a69cc8443`; giữ quyền riêng tư.
- Biến runtime quản trị đã cấu hình qua Sites (không lưu thông tin nhạy cảm trong mã nguồn).
- Tải Git portable bị chậm và timeout. Đã tìm thấy Git có sẵn trong GitHub Desktop để tiếp tục đồng bộ nguồn, tránh tải lại.
- Đã đồng bộ nguồn Sites ở commit `4e69c225047906a6bc8502a068f498f2dfb4cf80` và xác minh lại bằng source helper.
- Build đã qua kiểm tra. Packager Bash không có trên Windows; đã dùng cùng helper chuẩn bị artifact của Sites với tar Windows, giữ manifest và migration. Archive đã được kiểm tra cấu trúc, dung lượng 9.067.892 byte.
- `get_site` xác nhận Site active, live version 1 và URL https://timtro-ueh-sinhvien.abuzzbetta32.chatgpt.site.

### Yêu cầu GitHub bổ sung

- Người dùng yêu cầu đưa mã nguồn lên repo `timtroueh` và xác nhận tạo repo riêng tư trong tài khoản `Schizophren-ia`.
- GitHub connector đang kết nối tài khoản khác; dùng phiên GitHub có sẵn trên máy cho đúng tài khoản đã chọn. Token chỉ dùng trong bộ nhớ, không lưu vào nguồn hoặc log.
- Đã chuẩn bị ZIP mã nguồn sạch trong `timtro-ueh/outputs/timtroueh-source.zip`.
- Đã tạo repo riêng tư https://github.com/Schizophren-ia/timtroueh và đẩy toàn bộ nguồn lên nhánh `main`.
- Đã xác minh GitHub API trả commit `1c1b3219bc4db85337b69c7e1afb8e6d5ac970d1`, khớp nguồn local. Commit cập nhật kết quả bàn giao sẽ nằm sau commit này.
- Đã kiểm tra danh sách tracked: không có `.dev.vars`, `.env*`, `node_modules`, `.wrangler`, `outputs` hay `.sites-runtime`.
- README, schema/migration, API, giao diện, tài nguyên ảnh, test và `plan.md` được đưa lên repo; hướng dẫn chạy có trong README.

### Cập nhật quyền truy cập public — 12/10/2026

- Người dùng xác nhận đã mở public repo GitHub và duyệt mở public website demo.
- Đã chuyển Sites từ `custom` sang `public`, revision 2; không thay đổi quyền quản trị của ứng dụng.
- Kiểm tra HTTP không gửi cookie/token: `/` và `/api/rooms` trả 200, không chuyển tới đăng nhập; `/api/session` trả `user: null`; `/api/admin/users` trả 401.
- Mọi người có thể xem/tìm phòng tại https://timtro-ueh-sinhvien.abuzzbetta32.chatgpt.site. Yêu thích, gửi đánh giá/liên hệ và quản trị vẫn cần đăng nhập.

### Sửa GitHub Actions / GitHub Pages — 12/10/2026

- Người dùng báo build thất bại và duyệt hướng sửa workflow đúng Vinext, giữ backend tại demo Sites, dùng GitHub Pages chuyển hướng tới demo public.
- Đã đọc workflow mới do người dùng thêm ở commit `1cf4c69` và cập nhật local bằng fast-forward, giữ lịch sử repo.
- Nguyên nhân: workflow Next.js mặc định dùng Node 20, chạy `npx next build` và `configure-pages` với `static_site_generator: next`, không phù hợp dự án ES Module/Vinext/Node >=22.13.
- Đã thay workflow bằng Node 24, kiểm tra TypeScript/backend và `npm run build`; tách bước deploy Pages, không chèn cấu hình Next.js.
- Bản build đầy đủ được lưu thành artifact Worker; Pages chỉ xuất bản trang chuyển hướng từ `pages/index.html` tới demo public. Có fallback link khi trình duyệt không tự chuyển hướng.
- Đang kiểm tra và theo dõi kết quả GitHub Actions; chưa ghi nhận run mới thành công trước khi GitHub xác nhận.

#### Kết quả sửa workflow đã xác minh

- Commit sửa: `48ed13ffc11b089840134d30105c324a53f580be`.
- Kiểm tra local: TypeScript qua, 5/5 kiểm tra backend qua; YAML workflow phân tích hợp lệ bằng js-yaml; `git diff --check` không lỗi.
- GitHub Actions run https://github.com/Schizophren-ia/timtroueh/actions/runs/38227338755: cả job `build` và `deploy` đã hoàn tất thành công. Các bước Node 24, dependency, typecheck, test backend, build Vinext, artifact và deploy Pages đều thành công.
- Link GitHub Pages: https://schizophren-ia.github.io/timtroueh/ — đã kiểm tra HTTP 200.
- Kiểm tra Chrome không đăng nhập: link Pages tự chuyển đến demo public, trang chủ hiển thị 3 phòng chính. Backend tiếp tục chạy trên Sites.
- README đã giải thích cách chạy workflow và vai trò của GitHub Pages; các cập nhật chỉ thay đổi tài liệu không kích hoạt lại CI.
- Trạng thái: đã sửa, build/deploy và luồng mở website từ GitHub đều đã xác minh thành công.


### Bổ sung OTP sinh viên UEH mô phỏng — 12/10/2026

- Người dùng chọn OTP mô phỏng hoàn toàn, không gửi mail thật và không dùng dịch vụ trả phí.
- Thêm đăng ký/đăng nhập tại `/account`, chỉ nhận đúng tên miền `st.ueh.edu.vn`. Hộp thư demo hiển thị OTP 6 số của lượt thao tác hiện tại.
- Backend D1: tài khoản demo tách riêng, mã băm dùng một lần trong 5 phút, chờ gửi lại 60 giây, tối đa 5 lần nhập sai; gửi lại thay mã cũ. Phiên 7 ngày qua cookie HttpOnly, SameSite=Lax, Secure trên HTTPS; đăng xuất thu hồi phiên.
- Luồng ChatGPT giữ cho chủ trọ/quản trị. OTP demo luôn có quyền sinh viên; backend chặn cấp quyền quản lý. Giao diện ghi rõ xác minh mô phỏng, chưa xác minh quyền sở hữu email; chỉ dùng dữ liệu mẫu.
- Thêm migration `0001_uneven_lyja.sql` và metadata; áp dụng local thành công. Không cần Resend, API key hay tên miền gửi thư.
- Kiểm tra: TypeScript và build Vinext thành công; 7/7 kiểm thử backend qua. Kiểm thử Chrome qua toàn bộ đăng ký, mã sai, đăng nhập lại sau cooldown, giữ phiên sau tải lại, yêu thích và đăng xuất; desktop/mobile không tràn ngang hoặc lỗi trình duyệt. Đang đồng bộ GitHub và xuất bản demo.
