# Nhà trọ UEH — giao diện tân sinh viên

Phương án được người dùng duyệt ngày 13/10/2026: giữ tinh thần trang Nhà trọ UEH, dùng logo UEH thay biểu tượng nhà, bỏ dòng thông báo học tập ở footer; giữ Hộp thư demo tại OTP.

## Nguồn và phương pháp

- Tham chiếu: https://nhatroueh.com/thong-tin-tro/ — kiểm tra trực tiếp bằng trình duyệt và computed styles.
- Logo UEH nguyên bản: https://hotro.ueh.edu.vn/images/logo-ueh.png?t=12321. Giữ màu, tỷ lệ và khoảng trống; phiên bản trắng/cam đặt trên nền xanh cổ vịt.
- Hướng dẫn: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, đọc SKILL.md, references/quick-reference.md và references/pro-rules.md.
- Máy không có Python chạy được; không chạy search.py hay tuyên bố có kết quả từ engine. Áp dụng trực tiếp nguyên tắc accessibility, màu tương phản, nhãn form, ưu tiên nội dung, responsive và phản hồi tương tác trong tài liệu của skill. Không cài thêm phần mềm hoặc gói trả phí.

## Màu và chữ

- Nhận diện: #80A6F2; điểm nhấn: #7EDDF2; nền: #F8F5F4, bề mặt trắng.
- Chữ: #18344E / #344355 / #596675. Màu hành động #2457A7 dùng với chữ trắng.
- Montserrat cho tiêu đề/giá/nhận diện; Be Vietnam Pro cho nội dung, đảm bảo tiếng Việt dễ đọc.
- Không dùng xanh nhạt với chữ trắng cho nút hành động chính. Màu trạng thái luôn kèm văn bản.

## Bố cục

- Trang chủ: lời chào tân sinh viên → tìm theo cơ sở/ngân sách/loại phòng → phòng gợi ý → hướng dẫn lựa chọn → cẩm nang 3 bước.
- Thẻ phòng: ảnh, khu vực, giá thuê, diện tích/số người/khoảng cách, tổng chi phí dự kiến, xác thực dữ liệu mẫu, còn phòng và hành động.
- Chi tiết phòng: ảnh và thông tin bên trái, bảng phí/liên hệ bên phải; checklist xem trọ có thể đánh dấu.
- Mobile: điều hướng dưới 5 mục; bộ lọc tìm kiếm thu gọn có aria-expanded; dự phòng khoảng trống cho thanh cố định và safe area.
- Không thay backend, các lớp xác thực dữ liệu, OTP mô phỏng hoặc quyền quản trị.

## Kiểm tra

- Các kích thước 375/390, 768, 1024, 1440 px và landscape, không tràn ngang.
- Nhãn form rõ ràng, font input 16px, nút chính đủ rộng, focus nhìn thấy, skip link, aria-current cho điều hướng.
- Kiểm thử tìm phòng, bộ lọc mobile, quick campus, lưu phòng, chi tiết/chi phí/checklist, OTP, quản trị và các trang phụ.
- Tôn trọng prefers-reduced-motion; không autoplay.
