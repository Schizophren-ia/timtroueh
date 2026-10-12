# Kế hoạch TìmTrọ UEH

Cập nhật: 12/10/2026.

## Workflow của người dùng

1. Người dùng nêu công việc.
2. Trình bày hướng và ý tưởng.
3. Người dùng duyệt.
4. Triển khai phạm vi đã duyệt.
5. Cập nhật kết quả thực hiện và kiểm tra vào file này.

**Trạng thái hiện tại: Website đã chạy và xuất bản demo riêng tư; đang đưa mã nguồn lên GitHub theo yêu cầu bổ sung.**
Người dùng xác nhận "Duyệt" ngày 12/10/2026. Mã nguồn nằm trong `timtro-ueh/`. Server local chạy tại http://127.0.0.1:5173/. Sites đã có bản live version 1 tại https://timtro-ueh-sinhvien.abuzzbetta32.chatgpt.site.

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
- [ ] Xuất bản demo riêng tư, bàn giao và cập nhật kết quả.

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
- Đang tạo repo và đẩy nguồn; chưa ghi nhận hoàn tất trước khi xác minh commit trên GitHub.
