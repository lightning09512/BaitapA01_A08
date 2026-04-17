const fs = require('fs');
const path = require('path');
const { sequelize, User, Product, Review, Order, OrderItem, CartItem, Coupon, Notification, UserFavorites, UserViewedHistory } = require('../models');

// Data hardcoded array from server.js
const productsData = [
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

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('✅ Cơ sở dữ liệu đồng bộ thành công. Bắt đầu seed data...');

        // Insert Products
        for (const p of productsData) {
            await Product.create({
                id: p.id,
                name: p.name,
                price: p.price,
                category: p.category,
                soldQuantity: p.soldQuantity,
                discountPercent: p.discountPercent,
                description: p.description,
                image: p.image,
                viewCount: 0 // Default
            });
        }
        console.log('✅ Đã nạp danh sách sản phẩm mẫu.');

        // Đọc từ data.json
        const dataPath = path.join(__dirname, '../data.json');
        if (fs.existsSync(dataPath)) {
            const raw = fs.readFileSync(dataPath, 'utf8');
            const data = JSON.parse(raw);
            const users = data.users || [];
            const reviews = data.reviews || [];

            // Insert Users
            for (const u of users) {
                const newUser = await User.create({
                    username: u.username,
                    password: u.password,
                    email: u.email,
                    name: u.name,
                    phone: u.phone,
                    avatar: u.avatar,
                    isVerified: u.isVerified || false,
                    verifyOtp: u.verifyOtp,
                    resetOtp: u.resetOtp,
                    points: u.points || 0,
                    tempEmail: u.tempEmail,
                    otp: u.otp,
                    tempPhone: u.tempPhone,
                    tempName: u.tempName,
                    otpPhone: u.otpPhone
                });

                // Insert Coupons for this user
                if (u.coupons && Array.isArray(u.coupons)) {
                    for (const c of u.coupons) {
                        await Coupon.create({
                            userId: newUser.id,
                            code: c.code,
                            discountPercent: c.discountPercent,
                            isUsed: c.isUsed || false,
                            description: c.description
                        });
                    }
                }

                // Insert Notifications
                if (u.notifications && Array.isArray(u.notifications)) {
                    for (const n of u.notifications) {
                        await Notification.create({
                            id: n.id,
                            userId: u.username,
                            title: n.title,
                            message: n.message,
                            isRead: n.isRead || false,
                            createdAt: n.timestamp || new Date()
                        });
                    }
                }

                // Insert CartItems
                if (u.cart && Array.isArray(u.cart)) {
                    for (const ci of u.cart) {
                        await CartItem.create({
                            userId: newUser.id,
                            productId: ci.productId,
                            quantity: ci.quantity
                        });
                    }
                }

                // Insert Orders
                if (u.orders && Array.isArray(u.orders)) {
                    for (const o of u.orders) {
                        const newOrder = await Order.create({
                            id: o.id.toString(),
                            userId: newUser.id,
                            status: o.status,
                            paymentMethod: o.paymentMethod || 'COD',
                            address: o.address,
                            phone: o.phone,
                            note: o.note,
                            subTotal: o.subTotal,
                            discountAmount: o.discountAmount,
                            totalAmount: o.totalAmount,
                            usedCoupon: o.usedCoupon,
                            usedPoints: o.usedPoints,
                            cancelRequested: o.cancelRequested || false,
                            confirmedAt: o.confirmedAt ? new Date(o.confirmedAt) : null,
                            cancelledAt: o.cancelledAt ? new Date(o.cancelledAt) : null,
                            createdAt: new Date(o.createdAt)
                        });

                        // Insert OrderItems
                        if (o.items && Array.isArray(o.items)) {
                            for (const oi of o.items) {
                                await OrderItem.create({
                                    orderId: newOrder.id,
                                    productId: oi.productId,
                                    name: oi.name,
                                    image: oi.image,
                                    unitPrice: oi.unitPrice,
                                    quantity: oi.quantity,
                                    lineTotal: oi.lineTotal
                                });
                            }
                        }
                    }
                }
            }
            console.log('✅ Đã nạp danh sách tài khoản, giỏ hàng, thông báo, đơn hàng, coupon.');

            // Insert Reviews
            for (const r of reviews) {
                // Find user by username
                const u = await User.findOne({ where: { username: r.username } });
                await Review.create({
                    userId: u ? u.id : null,
                    productId: r.productId,
                    username: r.username,
                    name: r.name,
                    avatar: r.avatar,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt ? new Date(r.createdAt) : new Date()
                });
            }
            console.log('✅ Đã nạp danh sách đánh giá sản phẩm.');
            
            // Handle User Favorites & ViewedHistory logic later if needed
            // Currently they are arrays of productIDs inside User json.
            for (const u of users) {
                const dbUser = await User.findOne({ where: { username: u.username } });
                if (dbUser && u.favorites && Array.isArray(u.favorites)) {
                    for (const fPid of u.favorites) {
                        await dbUser.addFavorite(fPid).catch(e => console.log("Fav err", e));
                    }
                }
                if (dbUser && u.viewedProducts && Array.isArray(u.viewedProducts)) {
                    for (const vPid of u.viewedProducts) {
                        await dbUser.addViewedProduct(vPid).catch(e => console.log("Viewed err", e));
                    }
                }
            }
        }
        console.log('✅ Quá trình Seed hoàn tất! Bạn có thể khởi động Server.');
        process.exit();

    } catch (error) {
        console.error('❌ Lỗi quá trình Seed:', error);
        process.exit(1);
    }
};

seedData();
