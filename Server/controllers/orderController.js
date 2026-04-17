const { Order, OrderItem, Product, User, Coupon, Notification } = require('../models');

const ORDER_STATUS = {
    NEW: 'NEW',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    SHIPPING: 'SHIPPING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};

const checkoutCod = async (req, res) => {
    try {
        const { address, phone, note, couponCode, pointsToUse } = req.body;
        const user = await User.findOne({ where: { username: req.user.username }, include: ['CartItems', 'Coupons'] });
        if (!user) return res.status(404).json({ message: "Lỗi user" });

        const cartItems = user.CartItems || [];
        if (cartItems.length === 0) return res.status(400).json({ message: "Giỏ hàng trống" });
        if (!address || !address.trim()) return res.status(400).json({ message: "Vui lòng nhập địa chỉ nhận hàng" });
        if (!phone || !phone.trim()) return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });

        let totalAmount = 0;
        let discountAmount = 0;
        let orderItemsData = [];

        // Calculate totals
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                const lineTotal = product.price * item.quantity;
                totalAmount += lineTotal;
                orderItemsData.push({
                    productId: product.id,
                    name: product.name,
                    image: product.image,
                    unitPrice: product.price,
                    quantity: item.quantity,
                    lineTotal: lineTotal
                });
            }
        }

        const subTotal = totalAmount;

        if (couponCode) {
            const coupon = await Coupon.findOne({ where: { userId: user.id, code: couponCode, isUsed: false } });
            if (coupon) {
                discountAmount += (subTotal * coupon.discountPercent) / 100;
                coupon.isUsed = true;
                await coupon.save();
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

        totalAmount = Math.max(0, subTotal - discountAmount);

        const newOrder = await Order.create({
            id: Date.now().toString(),
            userId: user.id,
            status: ORDER_STATUS.NEW,
            paymentMethod: 'COD',
            address,
            phone,
            note: note || '',
            subTotal,
            discountAmount,
            totalAmount,
            usedCoupon: couponCode || null,
            usedPoints: pointsToUse ? Number(pointsToUse) : 0,
            cancelRequested: false,
        });

        // Save order items
        for (const oi of orderItemsData) {
            await OrderItem.create({ ...oi, orderId: newOrder.id });
        }

        // Clear cart
        await Promise.all(cartItems.map(c => c.destroy()));

        // Save user points
        await user.save();

        // Notification
        await Notification.create({
            id: Date.now().toString(),
            userId: user.username,
            title: 'Đặt hàng thành công!',
            message: `Đơn hàng mới với tổng tiền ${totalAmount.toLocaleString()}đ đã được đặt thành công.`,
            isRead: false
        });

        res.json({ message: "Đặt hàng COD thành công", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        if (!user) return res.status(404).json({ message: "Lỗi user" });

        const orders = await Order.findAll({
            where: { userId: user.id },
            include: [{ model: OrderItem }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        const order = await Order.findOne({
            where: { id: req.params.id, userId: user.id },
            include: [{ model: OrderItem }]
        });
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        const order = await Order.findOne({ where: { id: orderId, userId: user.id } });

        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        const now = new Date();
        const diffMinutes = (now - order.createdAt) / (60 * 1000);

        if (order.status === ORDER_STATUS.NEW || order.status === ORDER_STATUS.CONFIRMED) {
            if (diffMinutes > 30) return res.status(400).json({ message: "Đã quá thời gian 30 phút, không thể hủy đơn" });
            order.status = ORDER_STATUS.CANCELLED;
            order.cancelledAt = now;
            await order.save();
            return res.json({ message: "Đã hủy đơn hàng thành công", order });
        }

        if (order.status === ORDER_STATUS.PREPARING) {
            order.cancelRequested = true;
            await order.save();
            return res.json({ message: "Đơn đang chuẩn bị hàng. Đã gửi yêu cầu hủy đơn cho shop.", order });
        }

        return res.status(400).json({ message: "Đơn hàng đã ở trạng thái không thể hủy" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderStatistics = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        const orders = await Order.findAll({ where: { userId: user.id } });

        let stats = {
            totalPending: 0, countPending: 0,
            totalShipping: 0, countShipping: 0,
            totalDelivered: 0, countDelivered: 0
        };

        orders.forEach(order => {
            const amt = order.totalAmount || 0;
            if (['NEW', 'CONFIRMED', 'PREPARING'].includes(order.status)) {
                stats.totalPending += amt; stats.countPending++;
            } else if (order.status === 'SHIPPING') {
                stats.totalShipping += amt; stats.countShipping++;
            } else if (order.status === 'DELIVERED') {
                stats.totalDelivered += amt; stats.countDelivered++;
            }
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkoutCod,
    getUserOrders,
    getOrderById,
    cancelOrder,
    getOrderStatistics
};
