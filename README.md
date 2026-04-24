# CellPhoneK - Giải pháp Nền tảng Thương mại Điện tử Di động Chuyên nghiệp

## 1. Giới thiệu dự án
CellPhoneK là một hệ sinh thái thương mại điện tử toàn diện được thiết kế chuyên biệt cho lĩnh vực kinh doanh thiết bị công nghệ. Dự án được xây dựng dựa trên tiêu chuẩn của các ứng dụng hàng đầu hiện nay, kết hợp giữa hiệu năng mạnh mẽ của backend Node.js và sự linh hoạt của frontend React Native. Đây không chỉ là một bài tập lớn mà còn là một nghiên cứu về cách tối ưu hóa trải nghiệm mua sắm trên thiết bị di động, từ khâu duyệt sản phẩm cho đến quản lý đơn hàng thời gian thực.

## 2. Kiến trúc hệ thống
Hệ thống được triển khai theo mô hình Client-Server độc lập, đảm bảo khả năng bảo trì và nâng cấp dễ dàng:
- Frontend: Ứng dụng di động đa nền tảng, sử dụng cơ chế quản lý trạng thái hiệu quả và điều hướng phức tạp.
- Backend: API Server xây dựng theo kiến trúc MVC (Model-View-Controller), cung cấp các dịch vụ RESTful API tiêu chuẩn.
- Real-time Layer: Sử dụng Socket.io để duy trì kết nối liên tục giữa khách hàng và quản trị viên, phục vụ cho hệ thống chat và thông báo tức thời.

## 3. Danh sách tính năng chi tiết

### 3.1. Phân hệ Khách hàng (Customer App)
- Hệ thống xác thực: Quy trình đăng ký khép kín với cơ chế xác minh OTP qua email, ngăn chặn tài khoản rác và bảo mật thông tin bằng mã hóa Bcrypt.
- Trải nghiệm mua sắm thông minh: Bộ lọc sản phẩm đa chiều theo Danh mục, Thương hiệu, Mức giá. Hệ thống gợi ý sản phẩm tương tự dựa trên danh mục.
- Quản lý biến thể sản phẩm (Product Variants): Hỗ trợ người dùng lựa chọn linh hoạt các cấu hình RAM, ROM và Màu sắc với giá trị đơn hàng được cập nhật tự động.
- Quy trình thanh toán (Checkout): Giỏ hàng thời gian thực, áp dụng điểm thưởng và quy trình xác nhận đơn hàng COD nghiêm ngặt.
- Trung tâm cá nhân: Theo dõi trạng thái đơn hàng chi tiết (từ khi đặt đến khi nhận), quản lý danh sách yêu thích và lịch sử sản phẩm đã xem.

### 3.2. Phân hệ Quản trị (Admin Dashboard)
- Quản trị dữ liệu tập trung: Giao diện dashboard trực quan với các biểu đồ thống kê doanh thu, sản phẩm bán chạy và tăng trưởng người dùng.
- Điều phối đơn hàng: Hệ thống quản lý trạng thái đơn hàng logic, cho phép admin duyệt, chuẩn bị hàng và theo dõi quá trình vận chuyển.
- Quản lý nội dung: Công cụ CMS mạnh mẽ để quản lý danh mục sản phẩm, biến thể và hình ảnh.
- Chăm sóc khách hàng: Hệ thống chat tập trung cho phép admin phản hồi khách hàng tức thì, cải thiện tỷ lệ chuyển đổi.

## 4. Đặc tả kỹ thuật và Công nghệ

### 4.1. Stack Công nghệ
- Frontend Framework: React Native (Expo SDK).
- Navigation: React Navigation (Stack & Tab Navigation).
- UI Library: React Native Paper & Vanilla CSS.
- Backend Runtime: Node.js & Express.js.
- Database Engine: MySQL 8.0.
- ORM Layer: Sequelize.
- Real-time: Socket.io.

### 4.2. Cơ sở dữ liệu (Database Schema)
Hệ thống bao gồm các thực thể chính:
- Users: Lưu trữ thông tin định danh, phân quyền (Admin/Customer) và trạng thái xác minh.
- Products: Thông tin cốt lõi của sản phẩm bao gồm tên, mô tả, danh mục, thương hiệu.
- ProductVariants: Các lựa chọn cấu hình (RAM, ROM, Màu sắc) và giá riêng biệt.
- Orders & OrderItems: Lưu trữ chi tiết giao dịch và thông tin vận chuyển.
- Reviews: Phản hồi của khách hàng về chất lượng sản phẩm.
- Messages: Lịch sử chat thời gian thực giữa người dùng và hệ thống.

## 5. Hướng dẫn cài đặt và Triển khai (Setup)

### Bước 1: Chuẩn bị môi trường
Yêu cầu máy tính đã cài đặt sẵn các công cụ sau:
- Node.js (Phiên bản 18.x trở lên).
- MySQL Server (Phiên bản 8.0 trở lên).
- Expo Go trên thiết bị di động hoặc Trình giả lập.

### Bước 2: Thiết lập Cơ sở dữ liệu
1. Mở phần mềm quản lý MySQL (như MySQL Workbench hoặc Navicat).
2. Tạo một Database mới với tên: `app_ban_hang_db`.
3. Import tệp dữ liệu `cellphonek_database.sql` (nằm tại thư mục gốc của dự án) vào Database vừa tạo. Lưu ý kiểm tra kỹ các ràng buộc khóa ngoại trong quá trình import.

### Bước 3: Cấu hình API Server (Backend)
1. Truy cập vào thư mục Server: `cd Server`.
2. Cài đặt các thư viện phụ thuộc: `npm install`.
3. Cấu hình tệp `.env`:
   - Mở tệp `.env` trong thư mục Server.
   - Điền thông tin `EMAIL_USER` (Email gửi) và `EMAIL_PASS` (App Password của Gmail) để hệ thống có thể gửi mã OTP.
4. Cấu hình kết nối Database:
   - Mở tệp `Server/config/database.js`.
   - Thay đổi `username` và `password` của MySQL cho phù hợp với tài khoản trên máy tính của bạn.
5. Khởi chạy Server: `npm start`.

### Bước 4: Cấu hình Ứng dụng di động (Frontend)
1. Quay lại thư mục gốc của dự án.
2. Cài đặt thư viện cho Frontend: `npm install`.
3. Cấu hình địa chỉ API:
   - Mở tệp `src/services/api.js`.
   - Tìm dòng `baseURL` và thay đổi `localhost` thành địa chỉ IP LAN của máy tính bạn (Ví dụ: `http://192.168.1.5:3000`). Điều này là bắt buộc để điện thoại có thể kết nối được với Server.

### Bước 5: Khởi chạy dự án
1. Tại thư mục gốc, chạy lệnh: `npx expo start`.
2. Sử dụng ứng dụng Expo Go trên điện thoại để quét mã QR hiển thị trên màn hình terminal.
3. Đảm bảo điện thoại và máy tính chạy Server kết nối chung một mạng Wi-Fi.

## 6. Xử lý sự cố thường gặp
- Lỗi kết nối API: Kiểm tra Firewall của Windows xem có đang chặn cổng 3000 hay không. Đảm bảo địa chỉ IP trong `api.js` là chính xác.
- Lỗi gửi OTP: Kiểm tra lại quyền truy cập của ứng dụng trong cài đặt tài khoản Google và đảm bảo sử dụng "Mật khẩu ứng dụng" thay vì mật khẩu chính.
- Lỗi đồng bộ DB: Nếu bảng không tự tạo, hãy kiểm tra lại cấu hình trong `Server/config/database.js`.

## 7. Bản quyền và Liên hệ
Dự án được phát triển cho mục đích học tập và nghiên cứu. Mọi hành vi sao chép hoặc sử dụng cho mục đích thương mại cần có sự đồng ý của tác giả.

Giấy phép phát hành: MIT License.
