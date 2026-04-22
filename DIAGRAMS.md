# Hệ thống Lược đồ Dự án (PlantUML)

Tài liệu này liệt kê các sơ đồ nghiệp vụ của ứng dụng CellphoneK được lưu trữ trong thư mục `diagrams/`. Các sơ đồ này được viết bằng ngôn ngữ **PlantUML (.puml)** để đảm bảo tính chuyên nghiệp và chuẩn hóa trong báo cáo.

---

## Danh sách các file sơ đồ

Tất cả các file dưới đây nằm trong thư mục: `[diagrams/](./diagrams/)`

### 1. Sơ đồ UseCase (Tổng quan)
- **File**: `usecase.puml`
- **Mô tả**: Mô tả tổng thể các phân hệ và chức năng của người dùng và quản trị viên.

### 2. Sơ đồ Sequence: Đăng nhập (Authentication)
- **File**: `auth_sequence.puml`
- **Mô tả**: Quy trình xác thực người dùng sử dụng Bcrypt và JWT.

### 3. Sơ đồ Sequence: Đặt hàng (Order Flow)
- **File**: `order_sequence.puml`
- **Mô tả**: Luồng nghiệp vụ giao dịch, kiểm tra tồn kho và trừ hàng.

### 4. Sơ đồ Sequence: Chat trực tuyến (Real-time Messaging)
- **File**: `chat_sequence.puml`
- **Mô tả**: Quy trình trao đổi dữ liệu tức thời qua Socket.io.

---

## Hướng dẫn xem hình ảnh
1. **Trong IDE (IntelliJ/VS Code)**: Mở file `.puml` và mở cửa sổ công cụ **PlantUML** (thường ở bên phải màn hình).
2. **Xem Online**: Copy nội dung file và dán vào [PlantUML Online Server](http://www.plantuml.com/plantuml/).
