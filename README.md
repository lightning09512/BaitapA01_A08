# CellPhoneK - Giai phap Nen tang Thuong mai Dien tu Di dong Chuyen nghiep

## 1. Gioi thieu du an
CellPhoneK la mot he sinh thai thuong mai dien tu toan dien duoc thiet ke chuyen biet cho linh vuc kinh doanh thiet bi cong nghe. Du an duoc xay dung dua tren tieu chuan cua cac ung dung hang dau hien nay, ket hop giua hieu nang manh me cua backend Node.js va su linh hoat cua frontend React Native. Day khong chi la mot bai tap lon ma con la mot nghien cuu ve cach toi uu hoa trai nghiem mua sam tren thiet bi di dong, tu khau duyet san pham cho den quan ly don hang thoi gian thuc.

## 2. Kien truc he thong
He thong duoc trien khai theo mo hinh Client-Server doc lap, dam bao kha nang bao tri va nang cap de dang:
- Frontend: Ung dung di dong da nen tang, su dung co che quan ly trang thai hieu qua va dieu huong phuc tap.
- Backend: API Server xay dung theo kien truc MVC (Model-View-Controller), cung cap cac dich vu RESTful API tieu chuan.
- Real-time Layer: Su dung Socket.io de duy tri ket noi lien tuc giua khach hang va quan tri vien, phuc vu cho he thong chat va thong bao tuc thoi.

## 3. Danh sach tinh nang chi tiet

### 3.1. Phan he Khach hang (Customer App)
- He thong xac thuc: Quy trinh dang ky khep kin vao co che xac minh OTP qua email, ngan chan tai khoan rac va bao mat thong tin bang ma hoa Bcrypt.
- Trai nghiem mua sam thong minh: Bo loc san pham da chieu theo Danh muc, Thuong hieu, Muc gia. He thong goi y san pham tuong tu dua tren danh muc.
- Quan ly bien the san pham (Product Variants): Ho tro nguoi dung lua chon linh hoat cac cau hinh RAM, ROM va Mau sac voi gia tri don hang duoc cap nhat tu dong.
- Quy trinh thanh toan (Checkout): Gio hang thoi gian thuc, ap dung diem thuong va quy trinh xac nhan don hang COD nghiem ngat.
- Trung tam ca nhan: Theo doi trang thai don hang chi tiet (tu khi dat den khi nhan), quan ly danh sach yeu thich va lich su san pham da xem.

### 3.2. Phan he Quan tri (Admin Dashboard)
- Quan tri du lieu tap trung: Giao dien dashboard truc quan voi cac bieu do thong ke doanh thu, san pham ban chay va tang truong nguoi dung.
- Dieu phoi don hang: He thong quan ly trang thai don hang logic, cho phep admin duyet, chuan bi hang va theo doi qua trinh van chuyen.
- Quan ly noi dung: Cong cu CMS manh me de quan ly danh muc san pham, bien the va hinh anh.
- Cham soc khach hang: He thong chat tap trung cho phep admin phan hoi khach hang tuc thi, cai thien ty le chuyen doi.

## 4. Dac ta ky thuat va Cong nghe

### 4.1. Stack Cong nghe
- Frontend Framework: React Native (Expo SDK) - Toi uu hieu nang render va ho tro da nen tang.
- Navigation: React Navigation (Stack & Tab Navigation) - Dieu huong phuc tap va muot ma.
- UI Library: React Native Paper & Vanilla CSS - Giao dien tinh te, hien dai theo phong cach Glassmorphism.
- Backend Runtime: Node.js & Express.js - Xu ly bat dong bo hieu qua, phu hop cho he thong nhieu truy van.
- Database Engine: MySQL 8.0 - Dam bao tinh toan ven du lieu (ACID).
- ORM Layer: Sequelize - Quan ly moi quan hien giua cac bang thong qua code JavaScript.

### 4.2. Co so du lieu (Database Schema)
He thong bao gom cac thuc the chinh:
- Users: Luu tru thong tin dinh danh, phan quyen (Admin/Customer) va trang thai xac minh.
- Products: Thong tin cot loi cua san pham bao gom ten, mo ta, danh muc, thuong hieu.
- ProductVariants: Cac lua chon cau hinh (RAM, ROM, Mau sac) va gia rieng biet.
- Orders & OrderItems: Luu tru chi tiet giao dich, thong tin van chuyen va gia tri tai thoi diem mua.
- Reviews: Phan hoi cua khach hang ve chat luong san pham.
- Messages: Lich su chat thoi gian thuc giua nguoi dung va he thong.

## 5. Huong dan cai dat va Trien khai

### Buoc 1: Chuan bi tai nguyen
- Tai va cai dat Node.js (Version 18+).
- Cai dat MySQL Server va dam bao service dang chay tren cong 3306.
- Cai dat Expo Go tren dien thoai di dong de kiem thu thuc te.

### Buoc 2: Thiet lap Co so du lieu
- Su dung cong cu query SQL de tao database: `CREATE DATABASE app_ban_hang_db;`.
- Import tep `cellphonek_database.sql` de thiet lap cau truc bang va du lieu mau. Tep nay chua cac rang buoc khoa ngoai (Foreign Keys) quan trong, vui long khong thay doi cau truc luc import.

### Buoc 3: Cau hinh API Server
- Di chuyen vao thu muc Server: `cd Server`.
- Thuc thi lenh: `npm install`.
- Chinh sua tep `Server/config/database.js`: Cap nhat `username` va `password` cua tai khoan MySQL tren may ban.
- Thiet lap tep `.env`: Dien email va mat khau ung dung (App Password) de he thong co the gui mail OTP.
- Khoi dong backend: `npm start`.

### Buoc 4: Khoi chay ung dung di dong
- Quay lai thu muc goc: `npm install`.
- Cau hinh dia chi ket noi: Mo tep `src/services/api.js`, thay `localhost` thanh IP mang noi bo cua may tinh (Vi du: `192.168.x.x`).
- Khoi dong Expo: `npx expo start`.
- Su dung camera dien thoai de quet ma QR hien thi tren terminal.

## 6. Xu ly su co thuong gap
- Khong ket noi duoc API: Kiem tra xem dien thoai va may tinh co dang dung chung mot mang Wi-Fi hay khong. Kiem tra Firewall cua Windows co dang chan cong 3000 hay khong.
- Loi gui Mail: Dam bao ban da bat "Xac minh 2 lop" cho Gmail va tao "Mat khau ung dung" (App Password).
- Loi DB: Kiem tra lai thong tin dang nhap MySQL trong file config.

## 7. Giay phep va Ban quyen
Du an CellPhoneK duoc phat trien cho muc dich hoc tap va nghien cuu. Moi hanh vi sao chep hoac su dung cho muc dich thuong mai can co su dong y cua tac gia. Du an phat hanh duoi giay phep MIT.
