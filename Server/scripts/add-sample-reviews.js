const { sequelize, User, Product, Order, OrderItem, Review } = require('../models');

const addSampleReviews = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Đang chạy script thêm đánh giá mẫu...');

        // 1. Tạo 2 tài khoản ảo (nếu chưa có)
        const [userA] = await User.findOrCreate({
            where: { username: 'nguyen_van_a' },
            defaults: {
                password: '123',
                email: 'nva@test.com',
                name: 'Nguyễn Văn A',
                phone: '0901234567',
                avatar: 'https://i.pravatar.cc/150?img=11',
                isVerified: true
            }
        });

        const [userB] = await User.findOrCreate({
            where: { username: 'tran_thi_b' },
            defaults: {
                password: '123',
                email: 'ttb@test.com',
                name: 'Trần Thị B',
                phone: '0987654321',
                avatar: 'https://i.pravatar.cc/150?img=5',
                isVerified: true
            }
        });

        // 2. Tìm vài sản phẩm đỉnh để thêm Order & Review
        const iphone = await Product.findOne({ where: { name: "iPhone 15 Pro Max" } });
        const samsung = await Product.findOne({ where: { name: "Samsung Galaxy S24 Ultra" } });
        const macbook = await Product.findOne({ where: { name: "MacBook Air M3 13 inch" } });

        // 3. Giả lập đơn hàng đã giao (DELIVERED) cho các user kia để thỏa mãn điều kiện mua hàng
        if (iphone && macbook) {
            const orderA = await Order.create({
                id: 'ORD_SAMPLE_A_' + Date.now(),
                userId: userA.id,
                status: 'DELIVERED',
                paymentMethod: 'COD',
                address: '123 Đường Số 1, HCM',
                phone: userA.phone,
                subTotal: iphone.price + macbook.price,
                totalAmount: iphone.price + macbook.price,
            });

            await OrderItem.create({
                orderId: orderA.id,
                productId: iphone.id,
                name: iphone.name,
                unitPrice: iphone.price,
                quantity: 1,
                lineTotal: iphone.price
            });

            await OrderItem.create({
                orderId: orderA.id,
                productId: macbook.id,
                name: macbook.name,
                unitPrice: macbook.price,
                quantity: 1,
                lineTotal: macbook.price
            });

            // Ghi đánh giá
            await Review.findOrCreate({
                where: { userId: userA.id, productId: iphone.id },
                defaults: {
                    username: userA.username,
                    name: userA.name,
                    avatar: userA.avatar,
                    rating: 5,
                    comment: "Điện thoại quá đỉnh, màn hình mượt. Mua của shop rất an tâm!",
                }
            });

            await Review.findOrCreate({
                where: { userId: userA.id, productId: macbook.id },
                defaults: {
                    username: userA.username,
                    name: userA.name,
                    avatar: userA.avatar,
                    rating: 4,
                    comment: "Máy mỏng nhẹ, pin trâu. Tuy nhiên màu Midnight bám vân tay hơi nhiều.",
                }
            });
        }

        if (samsung) {
            const orderB = await Order.create({
                id: 'ORD_SAMPLE_B_' + Date.now(),
                userId: userB.id,
                status: 'DELIVERED',
                paymentMethod: 'COD',
                address: '456 Đường Số 2, Hà Nội',
                phone: userB.phone,
                subTotal: samsung.price,
                totalAmount: samsung.price,
            });

            await OrderItem.create({
                orderId: orderB.id,
                productId: samsung.id,
                name: samsung.name,
                unitPrice: samsung.price,
                quantity: 1,
                lineTotal: samsung.price
            });

            // Ghi đánh giá
            await Review.findOrCreate({
                where: { userId: userB.id, productId: samsung.id },
                defaults: {
                    username: userB.username,
                    name: userB.name,
                    avatar: userB.avatar,
                    rating: 5,
                    comment: "Tính năng AI của S24 Ultra cực kỳ tiện lợi. Spen ghi chú rất đã.",
                }
            });
        }

        console.log('✅ Đã thêm xong đơn hàng mẫu và đánh giá thành công.');
        process.exit();
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

addSampleReviews();
