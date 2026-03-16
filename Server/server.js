const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const http = require('http'); // added for socket.io
const { Server } = require('socket.io'); // added for socket.io

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = 3000;
const SECRET_KEY = "SECRET_KEY_A04";
const DATA_FILE = './data.json';

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// --- QUẢN LÝ DỮ LIỆU (LƯU FILE) ---
let users = [];
let reviews = [];

const loadData = () => {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                // Migrate từ cấu trúc cũ (chỉ có mảng users)
                users = parsed;
                reviews = [];
                console.log("✅ Đã migrate dữ liệu cũ sang cấu trúc mới.");
                saveData(); // Lưu lại theo cấu trúc mới
            } else {
                users = parsed.users || [];
                reviews = parsed.reviews || [];
                console.log("✅ Đã tải dữ liệu lên thành công.");
            }
        } catch (e) {
            console.log("⚠️ Lỗi đọc file, dùng dữ liệu mặc định.");
            initDefault();
        }
    } else {
        console.log("ℹ️ Chưa có dữ liệu, tạo mới.");
        initDefault();
    }
};

const initDefault = () => {
    users = [
        {
            username: "admin",
            password: "123",
            email: "admin@test.com",
            name: "Admin User",
            phone: "0909000111",
            avatar: "https://i.pravatar.cc/150?img=3",
            isVerified: true,
            notifications: []
        }
    ];
    reviews = [];
    saveData();
};

const saveData = () => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ users, reviews }, null, 2));
    } catch (e) {
        console.log("❌ Lỗi lưu file:", e);
    }
};

loadData();

// --- DỮ LIỆU SẢN PHẨM ---
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 34990000, category: "Phone", soldQuantity: 4200, discountPercent: 5, description: "Titan tự nhiên, 256GB, Chip A17 Pro mạnh mẽ nhất. Màn hình Super Retina XDR 6.7 inch, Camera 48MP với zoom quang học 5x.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH8boYZTiYz5boNoOG3-NkB8W-0i4BXFBlrw&s" },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 33990000, category: "Phone", soldQuantity: 3800, discountPercent: 8, description: "Quyền năng AI, Camera 200MP, Snap 8 Gen 3. Màn hình Dynamic AMOLED 2X 6.8 inch, S Pen tích hợp.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSI9OihvPcEuLhhnO9aV7hjjwQjOy-P8UgKQ&s" },
    { id: 7, name: "Xiaomi 14 Ultra", price: 24990000, category: "Phone", soldQuantity: 2100, discountPercent: 12, description: "Camera Leica 50MP, Snapdragon 8 Gen 3, Màn hình AMOLED 6.73 inch 2K, Pin 5300mAh sạc nhanh 90W.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQghzo0iEbE16bjUpunNA-dCSFXRk6-rhEC_w&s" },
    { id: 8, name: "OPPO Find X7 Ultra", price: 26990000, category: "Phone", soldQuantity: 1800, discountPercent: 10, description: "Camera 50MP kép, Snapdragon 8 Gen 3, Màn hình LTPO 6.82 inch, Sạc nhanh 100W SuperVOOC.", image: "https://cdn.viettablet.com/images/detailed/59/oppo-find-x7-ultra-1.jpg" },
    { id: 9, name: "Google Pixel 8 Pro", price: 22990000, category: "Phone", soldQuantity: 1500, discountPercent: 15, description: "Camera 50MP với AI, Tensor G3, Màn hình OLED 6.7 inch, Magic Eraser và các tính năng AI độc đáo.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxSBtRHHdVQB_T2ZOeNUiRh0dTL7q7mSW-Ng&s" },
    { id: 3, name: "MacBook Air M3 13 inch", price: 27990000, category: "Laptop", soldQuantity: 3500, discountPercent: 3, description: "Mỏng nhẹ, Chip M3, Pin 18 tiếng. Màn hình Retina 13.6 inch, 8GB RAM, 256GB SSD. Thiết kế siêu mỏng chỉ 1.24cm.", image: "https://cdn2.fptshop.com.vn/unsafe/macbook_air_13_m2_midnight_1_35053fbcf9.png" },
    { id: 4, name: "Dell XPS 13 Plus", price: 45000000, category: "Laptop", soldQuantity: 890, discountPercent: 7, description: "Thiết kế tương lai, màn hình OLED 3.5K 13.4 inch, Intel Core i7 gen 13, 16GB RAM, 512GB SSD.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s" },
    { id: 10, name: "ASUS ROG Zephyrus G16", price: 42990000, category: "Laptop", soldQuantity: 2200, discountPercent: 6, description: "Gaming laptop mạnh mẽ, RTX 4060, Intel Core i9, Màn hình 16 inch 165Hz, 16GB RAM, 1TB SSD.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-FPlsI-qhjGQomKf0ODIRhSqmjJwyrrTwQ&s" },
    { id: 11, name: "Lenovo ThinkPad X1 Carbon", price: 38990000, category: "Laptop", soldQuantity: 1650, discountPercent: 4, description: "Laptop doanh nhân cao cấp, Intel Core i7, Màn hình 14 inch 2.8K, 16GB RAM, 512GB SSD, Bàn phím ThinkPad huyền thoại.", image: "https://ttcenter.com.vn/uploads/product/a7gv07yw-935-thinkpad-x1-carbon-gen-8-i7-16gb-512gb-2k-99.jpg" },
    { id: 12, name: "HP Spectre x360 14", price: 34990000, category: "Laptop", soldQuantity: 1200, discountPercent: 9, description: "Laptop 2-in-1 cao cấp, Intel Core i7, Màn hình OLED 14 inch cảm ứng, 16GB RAM, 512GB SSD, Xoay 360 độ.", image: "https://anphat.com.vn/media/product/49108_laptop_hp_spectre_x360_14_eu0050tu_a19blpa___1_.jpg" },
    { id: 6, name: "iPad Pro M4 11 inch", price: 28990000, category: "Tablet", soldQuantity: 2800, discountPercent: 2, description: "Màn hình Ultra Retina XDR, mỏng nhất Apple. Chip M4 mạnh mẽ, Camera 12MP, Hỗ trợ Apple Pencil và Magic Keyboard.", image: "https://cdn.tgdd.vn/Products/Images/522/325513/ipad-pro-11-inch-m4-wifi-sliver-1-750x500.jpg" },
    { id: 13, name: "Samsung Galaxy Tab S9 Ultra", price: 24990000, category: "Tablet", soldQuantity: 1400, discountPercent: 11, description: "Tablet Android cao cấp, Màn hình Super AMOLED 14.6 inch, Snapdragon 8 Gen 2, S Pen tích hợp, 12GB RAM, 256GB.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s" },
    { id: 14, name: "Microsoft Surface Pro 9", price: 31990000, category: "Tablet", soldQuantity: 950, discountPercent: 14, description: "Tablet Windows 2-in-1, Intel Core i7, Màn hình 13 inch PixelSense, Surface Pen và Type Cover tùy chọn.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-FPlsI-qhjGQomKf0ODIRhSqmjJwyrrTwQ&s" },
    { id: 15, name: "iPad Air M2 11 inch", price: 19990000, category: "Tablet", soldQuantity: 3100, discountPercent: 5, description: "iPad Air thế hệ mới, Chip M2, Màn hình Liquid Retina 11 inch, Camera 12MP, Hỗ trợ Apple Pencil 2.", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-11-wifi-1.jpg" },
    { id: 5, name: "Sony WH-1000XM5", price: 6490000, category: "Accessory", soldQuantity: 5100, discountPercent: 10, description: "Tai nghe chống ồn tốt nhất thế giới. Chống ồn chủ động, Pin 30 giờ, Sạc nhanh 3 phút dùng 3 giờ, Chất lượng âm thanh Hi-Res.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6BWGZyqSmuqISxAlMaC4-ZB6O_N9B1e9dwA&s" },
    { id: 16, name: "AirPods Pro 2", price: 5990000, category: "Accessory", soldQuantity: 4800, discountPercent: 8, description: "Tai nghe không dây Apple, Chống ồn chủ động, Spatial Audio, Pin 6 giờ + case 30 giờ, MagSafe charging.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfgGOqWWb6x7wV8I8N9MD1jx-dWc9OrKh8w&s" },
    { id: 17, name: "Apple Watch Ultra 2", price: 18990000, category: "Accessory", soldQuantity: 1900, discountPercent: 4, description: "Đồng hồ thông minh cao cấp, Màn hình 49mm, Pin 36 giờ, Chống nước 100m, GPS kép, Titanium case.", image: "https://bvtmobile.com/uploads/source/apw-ultra-2024/ocean-orange.jpg" },
    { id: 18, name: "Samsung Galaxy Watch 6 Classic", price: 8990000, category: "Accessory", soldQuantity: 2600, discountPercent: 18, description: "Đồng hồ thông minh Android, Màn hình 47mm, Vòng bezel xoay, Pin 2 ngày, Đo huyết áp, ECG.", image: "https://cdn.tgdd.vn/Products/Images/7077/310858/samsung-galaxy-watch6-classic-47mm-bac-1-750x500.png" },
    { id: 19, name: "Logitech MX Master 3S", price: 2490000, category: "Accessory", soldQuantity: 4200, discountPercent: 20, description: "Chuột không dây cao cấp, Cảm biến Darkfield 8000 DPI, Pin 70 ngày, Kết nối đa thiết bị, Scroll wheel MagSpeed.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi8cc40trQNmJwSLANlBbwBdz2wHuqIM42ag&s" },
    { id: 20, name: "Magic Keyboard iPad Pro", price: 3990000, category: "Accessory", soldQuantity: 1100, discountPercent: 15, description: "Bàn phím Apple cho iPad Pro, Thiết kế gập, Trackpad tích hợp, Pin sạc qua Smart Connector, Backlit keys.", image: "https://cdn2.cellphones.com.vn/x/media/catalog/product/b/a/ban-phim-apple-magic-keyboard-ipad-pro-13-inch-m4_1.jpg" },
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    users.push({
        username,
        password,
        email,
        phone: "",
        avatar: "https://i.pravatar.cc/150?img=12",
        isVerified: false,
        verifyOtp: otp,
        points: 0,
        coupons: [],
        favorites: [],
        viewedProducts: [],
        notifications: []
    });

    saveData();
    console.log(`\n=== OTP XÁC MINH TÀI KHOẢN CHO ${email}: ${otp} ===\n`);
    res.json({
        message: "Đăng ký thành công! Vui lòng kiểm tra terminal server để xem mã OTP.",
        requiresVerification: true
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    if (user.isVerified === false) {
        return res.json({
            requiresVerification: true,
            message: "Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để nhập mã OTP."
        });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ token, user });
});

app.post('/verify-account', (req, res) => {
    const { email, otp } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    if (user.isVerified === true) return res.json({ message: "Tài khoản đã được xác minh trước đó", requiresVerification: false });
    if (user.verifyOtp !== otp) return res.status(400).json({ message: "Mã OTP không đúng" });

    user.isVerified = true;
    user.verifyOtp = null;
    saveData();
    res.json({ message: "Xác minh tài khoản thành công!", requiresVerification: false });
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    if (user.isVerified === false) return res.status(400).json({ message: "Tài khoản chưa được xác minh, vui lòng xác minh trước." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    saveData();
    console.log(`\n=== OTP QUÊN MẬT KHẨU CHO ${email}: ${otp} ===\n`);
    res.json({ message: `Đã gửi mã OTP đến ${email}. Vui lòng kiểm tra terminal server để xem mã OTP!` });
});

app.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    if (user.isVerified === false) return res.json({ requiresVerification: true, message: "Tài khoản chưa được xác minh." });
    if (!user.resetOtp || user.resetOtp !== otp) return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn" });

    user.password = newPassword;
    user.resetOtp = null;
    saveData();
    res.json({ message: "Đổi mật khẩu thành công!" });
});

app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    res.json(user);
});

app.put('/profile/update', authenticateToken, (req, res) => {
    const { avatar } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (user) {
        if (avatar) user.avatar = avatar;
        saveData();
        res.json({ message: "Cập nhật avatar thành công", user });
    } else {
        res.status(404).json({ message: "Lỗi user" });
    }
});

app.post('/profile/change-password', authenticateToken, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (user.password !== oldPassword) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    user.password = newPassword;
    saveData();
    res.json({ message: "Đổi mật khẩu thành công" });
});

app.post('/profile/request-email', authenticateToken, (req, res) => {
    const { newEmail } = req.body;
    const user = users.find(u => u.username === req.user.username);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.tempEmail = newEmail;
    user.otp = otp;
    saveData();
    console.log(`\n=== OTP GỬI TỚI ${newEmail}: ${otp} ===\n`);
    res.json({ message: "OTP đã gửi (Xem console server)" });
});

app.post('/profile/verify-email', authenticateToken, (req, res) => {
    const { otp } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (user.otp === otp) {
        user.email = user.tempEmail;
        user.otp = null;
        user.tempEmail = null;
        saveData();
        res.json({ message: "Đổi Email thành công", newEmail: user.email });
    } else {
        res.status(400).json({ message: "Mã OTP không đúng" });
    }
});

app.post('/profile/request-phone', authenticateToken, (req, res) => {
    const { newPhone, newName } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    if (!newPhone && !newName) return res.status(400).json({ message: "Vui lòng nhập họ tên hoặc số điện thoại mới" });

    if (newPhone) {
        const existed = users.find(u => u.phone === newPhone && u.username !== user.username);
        if (existed) return res.status(400).json({ message: "Số điện thoại này đã được sử dụng" });
        user.tempPhone = newPhone;
    }
    if (newName) user.tempName = newName;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpPhone = otp;
    saveData();
    console.log(`\n=== OTP CẬP NHẬT HỒ SƠ CHO USER ${user.username}: ${otp} ===\n`);
    res.json({ message: "Đã tạo mã OTP cập nhật thông tin." });
});

app.post('/profile/verify-phone', authenticateToken, (req, res) => {
    const { otp } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    if (user.otpPhone !== otp) return res.status(400).json({ message: "Mã OTP không đúng" });

    if (user.tempPhone) user.phone = user.tempPhone;
    if (user.tempName) user.name = user.tempName;
    user.otpPhone = null;
    user.tempPhone = null;
    user.tempName = null;
    saveData();
    res.json({ message: "Cập nhật thông tin thành công", user });
});

const ensureUserData = (user) => {
    if (!user.cart) user.cart = [];
    if (!user.orders) user.orders = [];
    if (typeof user.points === 'undefined') user.points = 0;
    if (!user.coupons) user.coupons = [];
    if (!user.favorites) user.favorites = [];
    if (!user.viewedProducts) user.viewedProducts = [];
    if (!user.notifications) user.notifications = [];
};

// --- SOCKET.IO NOTIFICATION LOGIC ---
const userSockets = new Map();

io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('register', (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`[Socket] User ${userId} registered to socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
        for (let [uid, sid] of userSockets.entries()) {
            if (sid === socket.id) {
                userSockets.delete(uid);
                break;
            }
        }
    });
});

function sendNotification(userId, title, message) {
    const user = users.find(u => u.username === userId || u.id === userId); // fallback to username or id
    if (!user) return;

    if (!user.notifications) user.notifications = [];
    
    const newNotif = {
        id: Date.now().toString(),
        title,
        message,
        createdAt: new Date().toISOString(),
        isRead: false
    };

    user.notifications.unshift(newNotif);
    saveData();

    // Map by username since we don't have user.id in registration logic
    const socketId = userSockets.get(user.username);
    if (socketId) {
        io.to(socketId).emit('new_notification', newNotif);
    }
}

const ORDER_STATUS = {
    NEW: 'NEW',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    SHIPPING: 'SHIPPING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};

const AUTO_CONFIRM_MINUTES = 30;

const autoUpdateOrderStatus = (order) => {
    const now = Date.now();
    if (order.status === ORDER_STATUS.NEW && now - order.createdAt >= AUTO_CONFIRM_MINUTES * 60 * 1000) {
        order.status = ORDER_STATUS.CONFIRMED;
        order.confirmedAt = order.confirmedAt || now;
    }
};

const buildCartResponse = (user) => {
    ensureUserData(user);
    const items = (user.cart || []).map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        const quantity = item.quantity || 1;
        const lineTotal = product.price * quantity;
        return {
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
            lineTotal,
        };
    }).filter(Boolean);

    const totalAmount = items.reduce((sum, it) => sum + it.lineTotal, 0);
    const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);

    return { items, totalAmount, totalQuantity };
};

app.get('/cart', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    return res.json(buildCartResponse(user));
});

app.post('/cart/add', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });

    const product = products.find(p => p.id === Number(productId));
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    ensureUserData(user);
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const existing = user.cart.find(i => i.productId === product.id);
    if (existing) existing.quantity += qty;
    else user.cart.push({ productId: product.id, quantity: qty });

    saveData();
    return res.json(buildCartResponse(user));
});

app.put('/cart/update', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const item = user.cart.find(i => i.productId === Number(productId));
    if (!item) return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

    const qty = Number(quantity) || 0;
    if (qty <= 0) user.cart = user.cart.filter(i => i.productId !== Number(productId));
    else item.quantity = qty;

    saveData();
    return res.json(buildCartResponse(user));
});

app.post('/cart/remove', authenticateToken, (req, res) => {
    const { productId } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    user.cart = user.cart.filter(i => i.productId !== Number(productId));
    saveData();
    return res.json(buildCartResponse(user));
});

app.post('/cart/clear', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    user.cart = [];
    saveData();
    return res.json(buildCartResponse(user));
});

app.post('/orders/checkout-cod', authenticateToken, (req, res) => {
    const { address, phone, note, couponCode, pointsToUse } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    if (!user.cart || user.cart.length === 0) return res.status(400).json({ message: "Giỏ hàng trống" });
    if (!address || !address.trim()) return res.status(400).json({ message: "Vui lòng nhập địa chỉ nhận hàng" });
    if (!phone || !phone.trim()) return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });

    const cartInfo = buildCartResponse(user);
    if (cartInfo.items.length === 0) return res.status(400).json({ message: "Giỏ hàng không hợp lệ" });

    let finalAmount = cartInfo.totalAmount;
    let discountAmount = 0;

    if (couponCode) {
        const coupon = user.coupons.find(c => c.code === couponCode && !c.isUsed);
        if (coupon) {
            discountAmount += (finalAmount * coupon.discountPercent) / 100;
            coupon.isUsed = true;
        } else {
            return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã sử dụng" });
        }
    }

    if (pointsToUse) {
        const pts = Number(pointsToUse);
        if (pts > 0 && user.points >= pts) {
            const pointsDiscount = pts * 1000;
            discountAmount += pointsDiscount;
            user.points -= pts;
        } else {
            return res.status(400).json({ message: "Điểm không hợp lệ hoặc không đủ" });
        }
    }

    finalAmount = Math.max(0, finalAmount - discountAmount);
    const now = Date.now();
    const order = {
        id: now.toString(),
        status: ORDER_STATUS.NEW,
        createdAt: now,
        paymentMethod: 'COD',
        address,
        phone,
        note: note || '',
        items: cartInfo.items.map(i => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            unitPrice: i.price,
            quantity: i.quantity,
            lineTotal: i.lineTotal,
        })),
        subTotal: cartInfo.totalAmount,
        discountAmount,
        totalAmount: finalAmount,
        usedCoupon: couponCode || null,
        usedPoints: pointsToUse ? Number(pointsToUse) : 0,
        cancelRequested: false,
    };

    user.orders.push(order);
    user.cart = [];
    saveData();

    // SOCKET: Send notification on successful order
    sendNotification(user.username, 'Đặt hàng thành công!', `Đơn hàng mới với tổng tiền ${finalAmount.toLocaleString()}đ đã được đặt thành công.`);

    res.json({ message: "Đặt hàng COD thành công", order });
});

app.get('/orders', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    (user.orders || []).forEach(autoUpdateOrderStatus);
    saveData();

    const list = [...user.orders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    res.json(list);
});

app.get('/orders/:id', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const order = (user.orders || []).find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    autoUpdateOrderStatus(order);
    saveData();
    res.json(order);
});

app.post('/orders/cancel', authenticateToken, (req, res) => {
    const { orderId } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const order = (user.orders || []).find(o => o.id === orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    autoUpdateOrderStatus(order);

    const now = Date.now();
    const diffMinutes = (now - order.createdAt) / (60 * 1000);

    if (order.status === ORDER_STATUS.NEW || order.status === ORDER_STATUS.CONFIRMED) {
        if (diffMinutes > 30) return res.status(400).json({ message: "Đã quá thời gian 30 phút, không thể hủy đơn" });
        order.status = ORDER_STATUS.CANCELLED;
        order.cancelledAt = now;
        saveData();
        return res.json({ message: "Đã hủy đơn hàng thành công", order });
    }

    if (order.status === ORDER_STATUS.PREPARING) {
        order.cancelRequested = true;
        saveData();
        return res.json({ message: "Đơn đang chuẩn bị hàng. Đã gửi yêu cầu hủy đơn cho shop.", order });
    }

    return res.status(400).json({ message: "Đơn hàng đã ở trạng thái không thể hủy" });
});

app.get('/products', (req, res) => {
    const { search, category, page, limit } = req.query;
    let result = products;

    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category && category !== 'All') result = result.filter(p => p.category === category);

    if (!page && !limit) return res.json(result);

    const pg = parseInt(page, 10) || 1;
    const lim = parseInt(limit, 10) || 10;
    const start = (pg - 1) * lim;
    const end = start + lim;
    const items = result.slice(start, end);
    const total = result.length;
    const hasMore = end < total;

    res.json({ items, page: pg, limit: lim, total, hasMore });
});

app.get('/products/best-selling', (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const list = [...products].sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)).slice(0, limit);
    res.json(list);
});

app.get('/products/by-discount', (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const list = [...products].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0)).slice(0, limit);
    res.json(list);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        const prodReviews = reviews.filter(r => r.productId === Number(req.params.id));
        res.json({
            ...product,
            viewCount: product.viewCount || 0,
            reviewCount: prodReviews.length
        });
    } else res.status(404).json({ message: "Không tìm thấy sản phẩm" });
});

// --- NEW APIs FOR PRODUCT REVIEWS ---
app.get('/products/:id/reviews', (req, res) => {
    const productId = Number(req.params.id);
    const prodReviews = reviews.filter(r => r.productId === productId).sort((a, b) => b.createdAt - a.createdAt);
    res.json(prodReviews);
});

app.post('/products/:id/reviews', authenticateToken, (req, res) => {
    const productId = Number(req.params.id);
    const { rating, comment } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const newReview = {
        id: Date.now().toString(),
        productId,
        username: user.username,
        name: user.name || user.username,
        avatar: user.avatar,
        rating: Number(rating) || 5,
        comment: comment || "",
        createdAt: Date.now()
    };
    reviews.push(newReview);
    
    // Tặng 100 điểm & 1 mã giảm giá 10%
    user.points += 100;
    const newCoupon = {
        code: 'REVIEW' + Date.now().toString().slice(-4),
        discountPercent: 10,
        isUsed: false,
        description: 'Mã giảm giá 10% từ Đánh giá sản phẩm'
    };
    user.coupons.push(newCoupon);
    
    saveData();

    // SOCKET: Send notification for review reward
    sendNotification(user.username, 'Đánh giá thành công!', `Bạn đã được thưởng 100 điểm và 1 mã giảm giá 10% (Mã: ${newCoupon.code}).`);

    res.json({ message: "Đánh giá thành công! Bạn được tặng 100 điểm và mã giảm giá 10%", review: newReview });
});

app.post('/products/:id/view', authenticateToken, (req, res) => {
    const productId = Number(req.params.id);
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    product.viewCount = (product.viewCount || 0) + 1;

    const user = users.find(u => u.username === req.user.username);
    if (user) {
        ensureUserData(user);
        user.viewedProducts = user.viewedProducts.filter(id => id !== productId);
        user.viewedProducts.unshift(productId);
        if (user.viewedProducts.length > 20) user.viewedProducts.pop();
        saveData();
    }
    res.json({ success: true, viewCount: product.viewCount });
});

app.get('/products/:id/similar', (req, res) => {
    const productId = Number(req.params.id);
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const similar = products.filter(p => p.category === product.category && p.id !== productId).slice(0, 10);
    res.json(similar);
});

// --- NEW APIs FOR FAVORITES ---
app.get('/favorites', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const favProducts = user.favorites.map(id => products.find(p => p.id === id)).filter(Boolean);
    res.json(favProducts);
});

app.post('/favorites/toggle', authenticateToken, (req, res) => {
    const { productId } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const pid = Number(productId);
    const index = user.favorites.indexOf(pid);
    let isFavorite = false;
    if (index >= 0) user.favorites.splice(index, 1);
    else {
        user.favorites.push(pid);
        isFavorite = true;
    }
    saveData();
    res.json({ isFavorite, favorites: user.favorites });
});

app.get('/favorites/check/:id', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    const isFavorite = user.favorites.includes(Number(req.params.id));
    res.json({ isFavorite });
});

// --- NEW APIs FOR WALLET & VIEWED ---
app.get('/users/wallet', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    res.json({
        points: user.points,
        coupons: user.coupons.filter(c => !c.isUsed)
    });
});

app.get('/users/viewed', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const viewed = user.viewedProducts.map(id => products.find(p => p.id === id)).filter(Boolean);
    res.json(viewed);
});

app.get('/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))].sort();
    res.json(categories);
});

// --- NEW APIs FOR NOTIFICATIONS ---
app.get('/notifications', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    res.json(user.notifications || []);
});

app.post('/notifications/read-all', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    
    if (user.notifications) {
        user.notifications.forEach(n => n.isRead = true);
    }
    saveData();
    res.json({ message: 'Đã đánh dấu đọc tất cả.' });
});

// --- NEW API FOR ORDER STATISTICS ---
app.get('/orders/statistics', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    
    const orders = user.orders || [];

    let totalPending = 0;
    let totalShipping = 0;
    let totalDelivered = 0;
    
    let countPending = 0;
    let countShipping = 0;
    let countDelivered = 0;

    orders.forEach(order => {
        const amount = order.totalAmount || 0;
        switch (order.status) {
            case 'NEW':
            case 'CONFIRMED':
            case 'PREPARING':
                totalPending += amount;
                countPending++;
                break;
            case 'SHIPPING':
                totalShipping += amount;
                countShipping++;
                break;
            case 'DELIVERED':
                totalDelivered += amount;
                countDelivered++;
                break;
        }
    });

    res.json({
        totalAmount: totalPending + totalShipping + totalDelivered,
        summary: {
            PENDING: { total: totalPending, count: countPending },
            SHIPPING: { total: totalShipping, count: countShipping },
            DELIVERED: { total: totalDelivered, count: countDelivered },
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log("Dữ liệu sẽ được lưu tự động vào file data.json");
});
