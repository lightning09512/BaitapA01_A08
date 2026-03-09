# SellphoneK - Đồ án LTDD Nâng Cao

## Giới thiệu dự án

SellphoneK là một ứng dụng di động được phát triển bằng React Native, chuyên về thương mại điện tử trong lĩnh vực công nghệ. Dự án được xây dựng với mục tiêu mang lại trải nghiệm mua sắm công nghệ tiện lợi và hiện đại cho người dùng.

**Tên dự án:** SellphoneK  
**Công nghệ:** React Native  
**Ngôn ngữ:** Tiếng Việt

## Tính năng chính

###  Xác thực người dùng
- **Đăng nhập:** Đăng nhập với tài khoản và mật khẩu
- **Đăng ký:** Tạo tài khoản mới với xác thực email
- **Quên mật khẩu:** Khôi phục mật khẩu qua OTP gửi qua email
- **Xác minh tài khoản:** Xác thực email trước khi sử dụng dịch vụ

###  Giao diện người dùng
- **Thiết kế hiện đại:** Giao diện tối với hiệu ứng glassmorphism
- **Animation mượt mà:** Hiệu ứng chuyển động mượt mà và thu hút
- **Responsive:** Tương thích tốt trên nhiều kích thước màn hình
- **Dark theme:** Giao diện tối chuyên nghiệp, giảm mỏi mắt

###  Bảo mật
- **Mã OTP:** Hệ thống bảo mật 2 lớp với mã OTP
- **Token xác thực:** Sử dụng JWT token để bảo vệ session
- **Xác thực email:** Bắt buộc xác thực email để tăng cường bảo mật

## Cấu trúc dự án

```
BaiTapA01_A08/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js          # Màn hình đăng nhập
│   │   │   ├── RegisterScreen.js       # Màn hình đăng ký
│   │   │   └── ForgotPasswordScreen.js # Màn hình quên mật khẩu
│   │   └── Main/
│   │       └── HomeScreen.js          # Màn hình chính
│   ├── services/
│   │   └── api.js                  # Cấu hình API
│   └── contexts/
│       └── providers/               # Context providers
├── Server/
│   ├── server.js                   # Backend server
│   ├── package.json               # Dependencies server
│   └── data.json                  # Dữ liệu mẫu
├── components/
│   └── ui/                       # UI components
├── constants/
│   └── theme.js                   # Theme configuration
└── assets/
    └── images/                    # Hình ảnh dự án
```

## Công nghệ sử dụng

### Frontend (React Native)
- **React Native:** Framework phát triển ứng dụng đa nền tảng
- **React Navigation:** Điều hướng giữa các màn hình
- **React Native Paper:** Component UI Material Design
- **AsyncStorage:** Lưu trữ dữ liệu local
- **Animated API:** Hiệu ứng và animation

### Backend (Node.js)
- **Node.js:** Runtime JavaScript phía server
- **Express.js:** Framework web cho API
- **JWT:** Xác thực người dùng
- **bcrypt:** Mã hóa mật khẩu

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Node.js:** phiên bản 14 trở lên
- **npm:** phiên bản 6 trở lên
- **React Native CLI:** phiên bản mới nhất
- **Android Studio** (cho Android) hoặc **Xcode** (cho iOS)

### Các bước cài đặt

1. **Clone dự án**
```bash
git clone <repository-url>
cd BaiTapA01_A08
```

2. **Cài đặt dependencies**
```bash
# Dependencies cho ứng dụng
npm install

# Dependencies cho server
cd Server
npm install
```

3. **Khởi động server backend**
```bash
cd Server
npm start
# Server sẽ chạy trên port 3001
```

4. **Cấu hình API**
- Mở file `src/services/api.js`
- Đảm bảo IP và port đúng với máy chạy server

5. **Chạy ứng dụng**
```bash
# Quay lại thư mục gốc
cd ..

# Chạy trên Android
npx react-native run-android

# Chạy trên iOS
npx react-native run-ios
```

## Tính năng đặc biệt

###  Hệ thống xác thực đa bước
1. **Đăng ký:** Người dùng điền thông tin cơ bản
2. **Xác thực email:** Gửi link xác thực đến email
3. **Kích hoạt:** Người dùng xác thực để kích hoạt tài khoản

###  Giao diện Glassmorphism
- **Hiệu ứng kính:** Background mờ với hiệu ứng trong suốt
- **Animation orbs:** Các quả cầu động tạo chiều sâu
- **Border radius:** Bo tròn mềm mại, hiện đại
- **Color scheme:** Palette màu xanh dương chuyên nghiệp

###  Performance optimization
- **Lazy loading:** Tải components khi cần thiết
- **Memoization:** Tối ưu hiệu suất render
- **Code splitting:** Chia nhỏ bundle để giảm kích thước

## Hướng dẫn sử dụng

### Đối với người dùng mới
1. Mở ứng dụng SellphoneK
2. Chọn "Đăng ký ngay"
3. Điền đầy đủ thông tin:
   - Tài khoản (tối thiểu 3 ký tự)
   - Email (hợp lệ)
   - Mật khẩu (tối thiểu 6 ký tự)
4. Nhấn "Tạo Tài Khoản"
5. Kiểm tra email để xác thực tài khoản
6. Đăng nhập sau khi xác thực

### Đối với người dùng đã có tài khoản
1. Mở ứng dụng
2. Nhập tài khoản và mật khẩu
3. Nhấn "Đăng Nhập"
4. Trải nghiệm dịch vụ

### Quên mật khẩu
1. Chọn "Quên mật khẩu?" trên màn hình đăng nhập
2. Nhập email đã đăng ký
3. Nhận mã OTP qua email
4. Nhập mã OTP và mật khẩu mới
5. Đăng nhập lại với mật khẩu mới

## Đóng góp và phát triển

### Môi trường phát triển
- **VS Code:** IDE chính cho phát triển
- **React Native Debugger:** Debug ứng dụng
- **Postman:** Test API endpoints

### Quy chuẩn code
- **ESLint:** Kiểm tra chất lượng code
- **Prettier:** Định dạng code tự động
- **Git version control:** Quản lý phiên bản

## Tương lai phát triển

### Version 1.1 (Dự kiến)
- [ ] Thêm thanh toán trực tuyến
- [ ] Giỏ hàng và wishlist
- [ ] Đánh giá sản phẩm
- [ ] Chat hỗ trợ khách hàng

### Version 2.0 (Dự kiến)
- [ ] Admin dashboard
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Progressive Web App

## Liên hệ và hỗ trợ

**Thực hiện bởi:** Nguyễn Minh Quốc Khánh - MSSV: 23110113
**Hướng dẫn:** Giảng viên phụ trách: Nguyễn Hữu Trung

---

## License

Dự án được phát triển cho mục đích học tập tại trường Đại học Sư phạm Kỹ thuật TP.HCM.

---

**SellphoneK - Công nghệ trong tầm tay** 
