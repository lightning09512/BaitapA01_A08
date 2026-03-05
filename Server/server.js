const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = 3000;
const SECRET_KEY = "SECRET_KEY_A04";
const DATA_FILE = './data.json';

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

let users = [];
const loadData = () => {
    if (fs.existsSync(DATA_FILE)) {
        try { users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
        catch (e) { initDefault(); }
    } else initDefault();
};
const initDefault = () => {
    users = [{ username: "admin", password: "123", email: "admin@test.com", name: "Admin", phone: "0909000111", avatar: "https://i.pravatar.cc/150?img=3" }];
    saveData();
};
const saveData = () => fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
loadData();

const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 34990000, category: "Phone", description: "Titan tự nhiên", image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg" },
    { id: 2, name: "MacBook Air M3", price: 27990000, category: "Laptop", description: "Chip M3", image: "https://cdn.tgdd.vn/Products/Images/44/322605/macbook-air-13-inch-m3-2024-040324-031124-600x600.jpg" },
];

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; next();
    });
};

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).json({ message: "Tài khoản tồn tại" });
    users.push({ username, password, email, name: "New User", phone: "", avatar: "https://i.pravatar.cc/150" });
    saveData();
    res.json({ message: "Thành công" });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Sai thông tin" });
    res.json({ token: jwt.sign({ username: user.username }, SECRET_KEY), user });
});

app.get('/profile', authenticateToken, (req, res) => res.json(users.find(u => u.username === req.user.username)));
app.put('/profile/update', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    Object.assign(user, req.body); saveData(); res.json({ message: "Thành công", user });
});
app.post('/profile/change-password', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (user.password !== req.body.oldPassword) return res.status(400).json({ message: "Sai mật khẩu cũ" });
    user.password = req.body.newPassword; saveData(); res.json({ message: "Thành công" });
});
app.post('/profile/request-email', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    user.otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.tempEmail = req.body.newEmail; saveData();
    console.log(`\n=== OTP GỬI TỚI ${user.tempEmail}: ${user.otp} ===\n`);
    res.json({ message: "Đã gửi OTP" });
});
app.post('/profile/verify-email', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (user.otp !== req.body.otp) return res.status(400).json({ message: "OTP sai" });
    user.email = user.tempEmail; user.otp = null; user.tempEmail = null; saveData();
    res.json({ message: "Thành công", newEmail: user.email });
});

app.get('/products', (req, res) => res.json(products));
app.get('/products/:id', (req, res) => res.json(products.find(p => p.id == req.params.id)));
// --- BỔ SUNG TÍNH NĂNG QUÊN MẬT KHẨU (TỪ TUẦN 2) ---
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: "Email chưa được đăng ký!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    saveData();

    console.log(`\n=== OTP KHÔI PHỤC MẬT KHẨU CỦA ${email}: ${otp} ===\n`);
    res.json({ message: "Đã gửi OTP khôi phục (Xem console)" });
});

app.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(400).json({ message: "User không tồn tại" });
    if (user.otp !== otp) return res.status(400).json({ message: "Mã OTP không đúng" });

    user.password = newPassword;
    user.otp = null; // Xóa OTP sau khi dùng xong
    saveData();

    res.json({ message: "Khôi phục mật khẩu thành công!" });
});
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));