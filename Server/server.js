const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs'); // Thêm thư viện đọc ghi file

const app = express();
const PORT = 3000;
const SECRET_KEY = "SECRET_KEY_A04";
const DATA_FILE = './data.json'; // File lưu dữ liệu

app.use(cors());
// Tăng limit để nhận ảnh avatar base64 từ src/screens/ProfileScreen.js
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// --- QUẢN LÝ DỮ LIỆU (LƯU FILE) ---
let users = [];

// 1. Hàm tải dữ liệu (Chạy 1 lần khi bật server)
const loadData = () => {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            users = JSON.parse(data);
            console.log("✅ Đã tải dữ liệu cũ lên thành công.");
        } catch (e) {
            console.log("⚠️ Lỗi đọc file, dùng dữ liệu mặc định.");
            initDefault();
        }
    } else {
        console.log("ℹ️ Chưa có dữ liệu, tạo mới.");
        initDefault();
    }
};

// 2. Hàm tạo dữ liệu mặc định nếu chưa có
const initDefault = () => {
    users = [
        {
            username: "admin",
            password: "123",
            email: "admin@test.com",
            name: "Admin User",
            phone: "0909000111",
            avatar: "https://i.pravatar.cc/150?img=3",
            isVerified: true // admin mặc định đã xác minh
        }
    ];
    saveData();
};

// 3. Hàm lưu dữ liệu (Gọi khi Đăng ký/Update)
const saveData = () => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (e) {
        console.log("❌ Lỗi lưu file:", e);
    }
};

// Tải dữ liệu ngay lập tức
loadData();

// --- DỮ LIỆU SẢN PHẨM (có soldQuantity, discountPercent cho API bán chạy & giảm giá) ---
const products = [
    // PHONE (soldQuantity: số lượng đã bán, discountPercent: % giảm giá)
    { id: 1, name: "iPhone 15 Pro Max", price: 34990000, category: "Phone", soldQuantity: 4200, discountPercent: 5, description: "Titan tự nhiên, 256GB, Chip A17 Pro mạnh mẽ nhất. Màn hình Super Retina XDR 6.7 inch, Camera 48MP với zoom quang học 5x.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH8boYZTiYz5boNoOG3-NkB8W-0i4BXFBlrw&s" },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 33990000, category: "Phone", soldQuantity: 3800, discountPercent: 8, description: "Quyền năng AI, Camera 200MP, Snap 8 Gen 3. Màn hình Dynamic AMOLED 2X 6.8 inch, S Pen tích hợp.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSI9OihvPcEuLhhnO9aV7hjjwQjOy-P8UgKQ&s" },
    { id: 7, name: "Xiaomi 14 Ultra", price: 24990000, category: "Phone", soldQuantity: 2100, discountPercent: 12, description: "Camera Leica 50MP, Snapdragon 8 Gen 3, Màn hình AMOLED 6.73 inch 2K, Pin 5300mAh sạc nhanh 90W.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQghzo0iEbE16bjUpunNA-dCSFXRk6-rhEC_w&s" },
    { id: 8, name: "OPPO Find X7 Ultra", price: 26990000, category: "Phone", soldQuantity: 1800, discountPercent: 10, description: "Camera 50MP kép, Snapdragon 8 Gen 3, Màn hình LTPO 6.82 inch, Sạc nhanh 100W SuperVOOC.", image: "https://cdn.viettablet.com/images/detailed/59/oppo-find-x7-ultra-1.jpg" },
    { id: 9, name: "Google Pixel 8 Pro", price: 22990000, category: "Phone", soldQuantity: 1500, discountPercent: 15, description: "Camera 50MP với AI, Tensor G3, Màn hình OLED 6.7 inch, Magic Eraser và các tính năng AI độc đáo.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxSBtRHHdVQB_T2ZOeNUiRh0dTL7q7mSW-Ng&s" },
    // LAPTOP
    { id: 3, name: "MacBook Air M3 13 inch", price: 27990000, category: "Laptop", soldQuantity: 3500, discountPercent: 3, description: "Mỏng nhẹ, Chip M3, Pin 18 tiếng. Màn hình Retina 13.6 inch, 8GB RAM, 256GB SSD. Thiết kế siêu mỏng chỉ 1.24cm.", image: "https://cdn2.fptshop.com.vn/unsafe/macbook_air_13_m2_midnight_1_35053fbcf9.png" },
    { id: 4, name: "Dell XPS 13 Plus", price: 45000000, category: "Laptop", soldQuantity: 890, discountPercent: 7, description: "Thiết kế tương lai, màn hình OLED 3.5K 13.4 inch, Intel Core i7 gen 13, 16GB RAM, 512GB SSD.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s" },
    { id: 10, name: "ASUS ROG Zephyrus G16", price: 42990000, category: "Laptop", soldQuantity: 2200, discountPercent: 6, description: "Gaming laptop mạnh mẽ, RTX 4060, Intel Core i9, Màn hình 16 inch 165Hz, 16GB RAM, 1TB SSD.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-FPlsI-qhjGQomKf0ODIRhSqmjJwyrrTwQ&s" },
    { id: 11, name: "Lenovo ThinkPad X1 Carbon", price: 38990000, category: "Laptop", soldQuantity: 1650, discountPercent: 4, description: "Laptop doanh nhân cao cấp, Intel Core i7, Màn hình 14 inch 2.8K, 16GB RAM, 512GB SSD, Bàn phím ThinkPad huyền thoại.", image: "https://cdn.tgdd.vn/Products/Images/44/312456/lenovo-thinkpad-x1-carbon-gen-11-thumb-600x600.jpg" },
    { id: 12, name: "HP Spectre x360 14", price: 34990000, category: "Laptop", soldQuantity: 1200, discountPercent: 9, description: "Laptop 2-in-1 cao cấp, Intel Core i7, Màn hình OLED 14 inch cảm ứng, 16GB RAM, 512GB SSD, Xoay 360 độ.", image: "https://anphat.com.vn/media/product/49108_laptop_hp_spectre_x360_14_eu0050tu_a19blpa___1_.jpg" },
    // TABLET
    { id: 6, name: "iPad Pro M4 11 inch", price: 28990000, category: "Tablet", soldQuantity: 2800, discountPercent: 2, description: "Màn hình Ultra Retina XDR, mỏng nhất Apple. Chip M4 mạnh mẽ, Camera 12MP, Hỗ trợ Apple Pencil và Magic Keyboard.", image: "https://cdn.tgdd.vn/Products/Images/522/325513/ipad-pro-11-inch-m4-wifi-sliver-1-750x500.jpg" },
    { id: 13, name: "Samsung Galaxy Tab S9 Ultra", price: 24990000, category: "Tablet", soldQuantity: 1400, discountPercent: 11, description: "Tablet Android cao cấp, Màn hình Super AMOLED 14.6 inch, Snapdragon 8 Gen 2, S Pen tích hợp, 12GB RAM, 256GB.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s" },
    { id: 14, name: "Microsoft Surface Pro 9", price: 31990000, category: "Tablet", soldQuantity: 950, discountPercent: 14, description: "Tablet Windows 2-in-1, Intel Core i7, Màn hình 13 inch PixelSense, Surface Pen và Type Cover tùy chọn.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-FPlsI-qhjGQomKf0ODIRhSqmjJwyrrTwQ&s" },
    { id: 15, name: "iPad Air M2 11 inch", price: 19990000, category: "Tablet", soldQuantity: 3100, discountPercent: 5, description: "iPad Air thế hệ mới, Chip M2, Màn hình Liquid Retina 11 inch, Camera 12MP, Hỗ trợ Apple Pencil 2.", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-11-wifi-1.jpg" },
    // ACCESSORY
    { id: 5, name: "Sony WH-1000XM5", price: 6490000, category: "Accessory", soldQuantity: 5100, discountPercent: 10, description: "Tai nghe chống ồn tốt nhất thế giới. Chống ồn chủ động, Pin 30 giờ, Sạc nhanh 3 phút dùng 3 giờ, Chất lượng âm thanh Hi-Res.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6BWGZyqSmuqISxAlMaC4-ZB6O_N9B1e9dwA&s" },
    { id: 16, name: "AirPods Pro 2", price: 5990000, category: "Accessory", soldQuantity: 4800, discountPercent: 8, description: "Tai nghe không dây Apple, Chống ồn chủ động, Spatial Audio, Pin 6 giờ + case 30 giờ, MagSafe charging.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfgGOqWWb6x7wV8I8N9MD1jx-dWc9OrKh8w&s" },
    { id: 17, name: "Apple Watch Ultra 2", price: 18990000, category: "Accessory", soldQuantity: 1900, discountPercent: 4, description: "Đồng hồ thông minh cao cấp, Màn hình 49mm, Pin 36 giờ, Chống nước 100m, GPS kép, Titanium case.", image: "https://bvtmobile.com/uploads/source/apw-ultra-2024/ocean-orange.jpg" },
    { id: 18, name: "Samsung Galaxy Watch 6 Classic", price: 8990000, category: "Accessory", soldQuantity: 2600, discountPercent: 18, description: "Đồng hồ thông minh Android, Màn hình 47mm, Vòng bezel xoay, Pin 2 ngày, Đo huyết áp, ECG.", image: "https://cdn.tgdd.vn/Products/Images/7077/310858/samsung-galaxy-watch6-classic-47mm-bac-1-750x500.png" },
    { id: 19, name: "Logitech MX Master 3S", price: 2490000, category: "Accessory", soldQuantity: 4200, discountPercent: 20, description: "Chuột không dây cao cấp, Cảm biến Darkfield 8000 DPI, Pin 70 ngày, Kết nối đa thiết bị, Scroll wheel MagSpeed.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi8cc40trQNmJwSLANlBbwBdz2wHuqIM42ag&s" },
    { id: 20, name: "Magic Keyboard iPad Pro", price: 3990000, category: "Accessory", soldQuantity: 1100, discountPercent: 15, description: "Bàn phím Apple cho iPad Pro, Thiết kế gập, Trackpad tích hợp, Pin sạc qua Smart Connector, Backlit keys.", image: "https://cdn2.cellphones.com.vn/x/media/catalog/product/b/a/ban-phim-apple-magic-keyboard-ipad-pro-13-inch-m4_1.jpg" },
];

// --- MIDDLEWARE ---
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

// --- AUTH API ---
// Dùng cho RegisterScreen.js
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
        // Tên mặc định = username (để đúng tên người đăng ký)
        name: username,
        // SĐT để trống, khách hàng tự cập nhật sau
        phone: "",
        avatar: "https://i.pravatar.cc/150?img=12",
        isVerified: false,
        verifyOtp: otp
    });

    saveData(); // <--- QUAN TRỌNG: Lưu lại ngay

    console.log(`\n=== OTP XÁC MINH TÀI KHOẢN CHO ${email}: ${otp} ===\n`);

    res.json({
        message: "Đăng ký thành công! Vui lòng kiểm tra terminal server để xem mã OTP.",
        requiresVerification: true
    });
});

// Dùng cho LoginScreen.js
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // Người dùng chưa xác minh tài khoản
    if (user.isVerified === false) {
        return res.json({
            requiresVerification: true,
            message: "Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để nhập mã OTP."
        });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ token, user });
});

// Xác minh tài khoản sau khi đăng ký - dùng cho VerifyAccountScreen.js
app.post('/verify-account', (req, res) => {
    const { email, otp } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    }

    // Nếu đã xác minh rồi thì cho qua luôn
    if (user.isVerified === true) {
        return res.json({ message: "Tài khoản đã được xác minh trước đó", requiresVerification: false });
    }

    if (user.verifyOtp !== otp) {
        return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    user.isVerified = true;
    user.verifyOtp = null;
    saveData();

    res.json({ message: "Xác minh tài khoản thành công!", requiresVerification: false });
});

// Quên mật khẩu - gửi OTP qua console, dùng cho ForgotPasswordScreen.js
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    }

    if (user.isVerified === false) {
        return res.status(400).json({ message: "Tài khoản chưa được xác minh, vui lòng xác minh trước." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    saveData();

    console.log(`\n=== OTP QUÊN MẬT KHẨU CHO ${email}: ${otp} ===\n`);

    res.json({ message: `Đã gửi mã OTP đến ${email}. Vui lòng kiểm tra terminal server để xem mã OTP!` });
});

// Đặt lại mật khẩu với OTP - dùng cho ForgotPasswordScreen.js
app.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    }

    if (user.isVerified === false) {
        // Cho frontend biết cần xác minh tài khoản trước
        return res.json({
            requiresVerification: true,
            message: "Tài khoản chưa được xác minh. Vui lòng xác minh tài khoản trước khi đặt lại mật khẩu."
        });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
        return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn" });
    }

    user.password = newPassword;
    user.resetOtp = null;
    saveData();

    res.json({ message: "Đổi mật khẩu thành công!" });
});

// --- PROFILE & USER-RELATED API ---
// Dùng cho ProfileScreen.js
app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    res.json(user);
});

// Cập nhật avatar (không cần OTP), tên & SĐT sẽ đi qua flow OTP ở dưới
app.put('/profile/update', authenticateToken, (req, res) => {
    const { avatar } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (user) {
        if (avatar) {
            user.avatar = avatar;
        }
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
    
    saveData(); // <--- Lưu mật khẩu mới
    res.json({ message: "Đổi mật khẩu thành công" });
});

app.post('/profile/request-email', authenticateToken, (req, res) => {
    const { newEmail } = req.body;
    const user = users.find(u => u.username === req.user.username);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.tempEmail = newEmail;
    user.otp = otp;
    
    saveData(); // <--- Lưu OTP tạm thời
    
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
        
        saveData(); // <--- Lưu email mới
        res.json({ message: "Đổi Email thành công", newEmail: user.email });
    } else {
        res.status(400).json({ message: "Mã OTP không đúng" });
    }
});

// Yêu cầu OTP khi đổi họ tên / SĐT
app.post('/profile/request-phone', authenticateToken, (req, res) => {
    const { newPhone, newName } = req.body;
    const user = users.find(u => u.username === req.user.username);

    if (!user) {
        return res.status(404).json({ message: "Lỗi user" });
    }

    if (!newPhone && !newName) {
        return res.status(400).json({ message: "Vui lòng nhập họ tên hoặc số điện thoại mới" });
    }

    // Nếu có SĐT mới thì kiểm tra trùng
    if (newPhone) {
        const existed = users.find(
            u => u.phone === newPhone && u.username !== user.username
        );
        if (existed) {
            return res.status(400).json({ message: "Số điện thoại này đã được sử dụng" });
        }
        user.tempPhone = newPhone;
    }

    // Nếu có tên mới thì lưu tạm
    if (newName) {
        user.tempName = newName;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpPhone = otp;

    saveData(); // <--- Lưu OTP tạm thời

    console.log(`\n=== OTP CẬP NHẬT HỒ SƠ (Tên/SĐT) CHO USER ${user.username}: ${otp} ===\n`);
    res.json({
        message: "Đã tạo mã OTP để cập nhật thông tin. Vui lòng kiểm tra OTP trong terminal server.",
    });
});

app.post('/profile/verify-phone', authenticateToken, (req, res) => {
    const { otp } = req.body;
    const user = users.find(u => u.username === req.user.username);

    if (!user) {
        return res.status(404).json({ message: "Lỗi user" });
    }

    if (user.otpPhone !== otp) {
        return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    // Nếu có dữ liệu tạm thì chốt sang chính thức
    if (user.tempPhone) {
        user.phone = user.tempPhone;
    }
    if (user.tempName) {
        user.name = user.tempName;
    }

    user.otpPhone = null;
    user.tempPhone = null;
    user.tempName = null;

    saveData(); // <--- Lưu thông tin mới
    res.json({ message: "Cập nhật thông tin thành công", user });
});

// --- CART & ORDER API ---

const ensureUserData = (user) => {
    if (!user.cart) user.cart = [];
    if (!user.orders) user.orders = [];
};

const ORDER_STATUS = {
    NEW: 'NEW', // 1. Đơn hàng mới
    CONFIRMED: 'CONFIRMED', // 2. Đã xác nhận
    PREPARING: 'PREPARING', // 3. Shop đang chuẩn bị hàng
    SHIPPING: 'SHIPPING', // 4. Đang giao hàng
    DELIVERED: 'DELIVERED', // 5. Đã giao thành công
    CANCELLED: 'CANCELLED', // 6. Hủy đơn hàng
};

const AUTO_CONFIRM_MINUTES = 30;

const autoUpdateOrderStatus = (order) => {
    const now = Date.now();
    if (order.status === ORDER_STATUS.NEW && now - order.createdAt >= AUTO_CONFIRM_MINUTES * 60 * 1000) {
        order.status = ORDER_STATUS.CONFIRMED;
        order.confirmedAt = order.confirmedAt || now;
    }
};

// Lấy thông tin giỏ hàng chi tiết từ user.cart
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

// Lấy giỏ hàng hiện tại
app.get('/cart', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);
    return res.json(buildCartResponse(user));
});

// Thêm sản phẩm vào giỏ
app.post('/cart/add', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });

    const product = products.find(p => p.id === Number(productId));
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    ensureUserData(user);
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const existing = user.cart.find(i => i.productId === product.id);
    if (existing) {
        existing.quantity += qty;
    } else {
        user.cart.push({ productId: product.id, quantity: qty });
    }

    saveData();
    return res.json(buildCartResponse(user));
});

// Cập nhật số lượng trong giỏ
app.put('/cart/update', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    const item = user.cart.find(i => i.productId === Number(productId));
    if (!item) return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

    const qty = Number(quantity) || 0;
    if (qty <= 0) {
        user.cart = user.cart.filter(i => i.productId !== Number(productId));
    } else {
        item.quantity = qty;
    }

    saveData();
    return res.json(buildCartResponse(user));
});

// Xóa 1 sản phẩm khỏi giỏ
app.post('/cart/remove', authenticateToken, (req, res) => {
    const { productId } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    user.cart = user.cart.filter(i => i.productId !== Number(productId));
    saveData();
    return res.json(buildCartResponse(user));
});

// Xóa toàn bộ giỏ
app.post('/cart/clear', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    user.cart = [];
    saveData();
    return res.json(buildCartResponse(user));
});

// Đặt hàng COD từ giỏ hàng
app.post('/orders/checkout-cod', authenticateToken, (req, res) => {
    const { address, phone, note } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    if (!user.cart || user.cart.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng trống, không thể đặt hàng" });
    }

    if (!address || !address.trim()) {
        return res.status(400).json({ message: "Vui lòng nhập địa chỉ nhận hàng" });
    }
    if (!phone || !phone.trim()) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại nhận hàng" });
    }

    const cartInfo = buildCartResponse(user);
    if (cartInfo.items.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng không hợp lệ" });
    }

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
        totalAmount: cartInfo.totalAmount,
        cancelRequested: false,
    };

    user.orders.push(order);
    user.cart = []; // Xóa giỏ sau khi đặt thành công
    saveData();

    res.json({ message: "Đặt hàng COD thành công", order });
});

// Lấy danh sách đơn hàng của user (tự động cập nhật trạng thái NEW -> CONFIRMED sau 30 phút)
app.get('/orders', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ message: "Lỗi user" });
    ensureUserData(user);

    (user.orders || []).forEach(autoUpdateOrderStatus);
    saveData();

    const list = [...user.orders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    res.json(list);
});

// Lấy chi tiết 1 đơn hàng
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

// Hủy đơn hàng (theo yêu cầu đề bài)
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

    // Chỉ cho phép hủy trong 30 phút đầu và khi đơn còn mới/đã xác nhận
    if (order.status === ORDER_STATUS.NEW || order.status === ORDER_STATUS.CONFIRMED) {
        if (diffMinutes > 30) {
            return res.status(400).json({ message: "Đã quá thời gian 30 phút, không thể hủy đơn" });
        }
        order.status = ORDER_STATUS.CANCELLED;
        order.cancelledAt = now;
        saveData();
        return res.json({ message: "Đã hủy đơn hàng thành công", order });
    }

    // Nếu đang ở bước 3 (PREPARING) thì đánh dấu gửi yêu cầu hủy
    if (order.status === ORDER_STATUS.PREPARING) {
        order.cancelRequested = true;
        saveData();
        return res.json({
            message: "Đơn đang chuẩn bị hàng. Đã gửi yêu cầu hủy đơn cho shop.",
            order,
        });
    }

    // Các trạng thái khác không cho phép hủy
    return res.status(400).json({ message: "Đơn hàng đã ở trạng thái không thể hủy" });
});

// --- PRODUCT API ---
// Dùng cho HomeScreen.js và ProductDetailScreen.js
// Hỗ trợ tìm kiếm, lọc category và phân trang (page, limit)
app.get('/products', (req, res) => {
    const { search, category } = req.query;
    let result = products;

    if (search) {
        result = result.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (category && category !== 'All') {
        result = result.filter(p => p.category === category);
    }

    const hasPaging = req.query.page || req.query.limit;
    if (!hasPaging) {
        // Giữ nguyên behaviour cũ: trả về toàn bộ mảng
        return res.json(result);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = result.slice(start, end);
    const total = result.length;
    const hasMore = end < total;

    res.json({
        items,
        page,
        limit,
        total,
        hasMore,
    });
});

// Phải đặt trước /products/:id để không bị nhầm :id = "best-selling" hoặc "by-discount"
app.get('/products/best-selling', (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const list = [...products]
        .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
        .slice(0, limit);
    res.json(list);
});

app.get('/products/by-discount', (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const list = [...products]
        .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
        .slice(0, limit);
    res.json(list);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Không tìm thấy sản phẩm" });
});

// --- API DANH SÁCH CATEGORY (cho danh sách category ngang) ---
app.get('/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))].sort();
    res.json(categories);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log("Dữ liệu sẽ được lưu tự động vào file data.json");
});

