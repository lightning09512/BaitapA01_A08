# CellphoneK - Premium E-commerce Mobile Application

CellphoneK là một ứng dụng thương mại điện tử chuyên về thiết bị điện tử, được phát triển với mục tiêu mang lại trải nghiệm mua sắm hiện đại, mượt mà và an toàn tương tự như các nền tảng lớn (CellphoneS, Shopee).

---

## Tính Năng Chính

### Cho Người Dùng (Customer)
- Hệ thống Tài khoản: Đăng ký, Đăng nhập, Quên mật khẩu qua OTP (Email). Bảo mật mật khẩu bằng Bcrypt.
- Trải nghiệm mua sắm:
    - Duyệt sản phẩm theo Danh mục, Thương hiệu.
    - Xem chi tiết sản phẩm với Thông số kỹ thuật đầy đủ.
    - Lựa chọn Biến thể (Variants): Chọn RAM, ROM, Màu sắc với giá thay đổi tương ứng.
- Giỏ hàng & Thanh toán: Quản lý giỏ hàng real-time, đặt hàng ship COD.
- Tương tác: Đánh giá sản phẩm (Reviews), yêu thích sản phẩm (Favorites), quản lý lịch sử xem.
- Hỗ trợ thực tế: Chat trực tuyến với người quản trị (Socket.io).

### Cho Quản Trị Viên (Admin)
- Bảng điều khiển (Dashboard): Thống kê doanh thu, đơn hàng, người dùng.
- Quản lý sản phẩm: Thêm, sửa, xóa sản phẩm và các biến thể.
- Quản lý đơn hàng: Theo dõi và cập nhật trạng thái đơn hàng (NEW -> CONFIRMED -> SHIPPING -> DELIVERED).
- Hỗ trợ khách hàng: Hệ thống chat đa luồng xử lý nhiều hội thoại cùng lúc.

---

## Công Nghệ Sử Dụng

| Lớp (Layer) | Công nghệ |
| :--- | :--- |
| Frontend | React Native (Expo), React Navigation, React Native Paper |
| Backend | Node.js, Express.js |
| Database | MySQL (thông qua Sequelize ORM) |
| Real-time | Socket.io |
| Security | JWT (JSON Web Token), Bcrypt Hashing |
| Email | Nodemailer |

---

## Cấu trúc Thư mục

```text
BaiTapA01_A08/
├── Server/               # Node.js Backend
│   ├── config/           # Cấu hình DB
│   ├── controllers/      # Logic nghiệp vụ (Auth, Product, Order...)
│   ├── models/           # Định nghĩa Schema (Sequelize)
│   ├── routes/           # Định nghĩa các Endpoint API
│   ├── services/         # Email, Chat services
│   └── server.js         # file chạy chính
├── src/                  # React Native Frontend
│   ├── components/       # Các UI Component tái sử dụng
│   ├── screens/          # Các màn hình (Main, Auth, Intro...)
│   ├── services/         # Axios API configuration
│   └── navigation/       # Cấu hình điều hướng App
└── App.js                # Entry point của ứng dụng
```

---

## Hướng dẫn Cài đặt

### Yêu cầu hệ thống
- Node.js (>= 18.x)
- MySQL Server

### 2. Cài đặt Backend
```bash
cd Server
npm install
# Cấu hình file .env trong thư mục Server với thông tin DB của bạn
npm start
```

### 3. Cài đặt Frontend
```bash
npm install
npx expo start
```

---

## Giao diện Ứng dụng
*(Bạn hãy chụp ảnh màn hình và thay thế vào đây)*
- [Màn hình Intro]
- [Trang chủ - Light Mode]
- [Chi tiết sản phẩm & Biến thể]
- [Dashboard Admin]

---

## Giấy phép
Dự án được phát hành dưới giấy phép MIT.
