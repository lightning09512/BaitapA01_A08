const { Product, Order, OrderItem, User, Notification, Sequelize } = require('../models');

// ========== MIDDLEWARE HELPER ==========
const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
    }
    next();
};

// ========== QUẢN LÝ SẢN PHẨM ==========

const getAllProducts = async (req, res) => {
    try {
        const { search, category, page, limit } = req.query;
        let whereClause = {};
        if (search) whereClause.name = { [Sequelize.Op.like]: `%${search}%` };
        if (category && category !== 'All') whereClause.category = category;

        const pg = parseInt(page, 10) || 1;
        const lim = parseInt(limit, 10) || 20;
        const offset = (pg - 1) * lim;

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            limit: lim,
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.json({ items: rows, total: count, page: pg, hasMore: offset + lim < count });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, category, description, image, discountPercent } = req.body;
        if (!name || !price) return res.status(400).json({ message: 'Tên và giá sản phẩm là bắt buộc.' });

        const product = await Product.create({
            name,
            price: Number(price),
            category: category || 'Khác',
            description: description || '',
            image: image || '',
            discountPercent: Number(discountPercent) || 0,
            soldQuantity: 0,
            viewCount: 0,
        });
        res.status(201).json({ message: 'Thêm sản phẩm thành công!', product });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });

        const { name, price, category, description, image, discountPercent } = req.body;
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = Number(price);
        if (category !== undefined) product.category = category;
        if (description !== undefined) product.description = description;
        if (image !== undefined) product.image = image;
        if (discountPercent !== undefined) product.discountPercent = Number(discountPercent);

        await product.save();
        res.json({ message: 'Cập nhật sản phẩm thành công!', product });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        await product.destroy();
        res.json({ message: 'Đã xoá sản phẩm thành công.' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ========== QUẢN LÝ ĐƠN HÀNG ==========

const getAllOrders = async (req, res) => {
    try {
        const { status, page, limit } = req.query;
        let whereClause = {};
        if (status && status !== 'ALL') whereClause.status = status;

        const pg = parseInt(page, 10) || 1;
        const lim = parseInt(limit, 10) || 20;
        const offset = (pg - 1) * lim;

        const { count, rows } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                { model: OrderItem },
                { model: User, attributes: ['username', 'name', 'phone', 'email'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: lim,
            offset,
        });

        res.json({ items: rows, total: count, page: pg, hasMore: offset + lim < count });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;
        const VALID_STATUSES = ['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
        if (!VALID_STATUSES.includes(newStatus)) {
            return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
        }

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

        const oldStatus = order.status;
        order.status = newStatus;
        if (newStatus === 'CONFIRMED') order.confirmedAt = new Date();
        if (newStatus === 'CANCELLED') order.cancelledAt = new Date();

        // Nếu hoàn thành đơn => cộng soldQuantity cho từng sản phẩm
        if (newStatus === 'DELIVERED' && oldStatus !== 'DELIVERED') {
            const items = await OrderItem.findAll({ where: { orderId: order.id } });
            for (const item of items) {
                const product = await Product.findByPk(item.productId);
                if (product) {
                    product.soldQuantity = (product.soldQuantity || 0) + item.quantity;
                    await product.save();
                }
            }
            // Gửi thông báo cho khách
            const user = await User.findByPk(order.userId);
            if (user) {
                await Notification.create({
                    id: Date.now().toString(),
                    userId: user.username,
                    title: 'Đơn hàng đã giao thành công!',
                    message: `Đơn hàng #${order.id.slice(-6)} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
                    isRead: false,
                });
            }
        }

        await order.save();
        res.json({ message: `Cập nhật trạng thái đơn hàng thành công: ${newStatus}`, order });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ========== QUẢN LÝ NGƯỜI DÙNG ==========

const getAllUsers = async (req, res) => {
    try {
        const { search, page, limit } = req.query;
        let whereClause = {};
        if (search) {
            whereClause[Sequelize.Op.or] = [
                { username: { [Sequelize.Op.like]: `%${search}%` } },
                { name: { [Sequelize.Op.like]: `%${search}%` } },
                { email: { [Sequelize.Op.like]: `%${search}%` } },
            ];
        }

        const pg = parseInt(page, 10) || 1;
        const lim = parseInt(limit, 10) || 20;
        const offset = (pg - 1) * lim;

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password', 'verifyOtp', 'resetOtp', 'otp', 'otpPhone'] },
            limit: lim,
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.json({ items: rows, total: count, page: pg, hasMore: offset + lim < count });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        if (!['customer', 'admin'].includes(newRole)) {
            return res.status(400).json({ message: 'Role không hợp lệ.' });
        }
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

        user.role = newRole;
        await user.save();
        res.json({ message: `Đã cập nhật quyền cho ${user.username} thành ${newRole}.` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ========== THỐNG KÊ DOANH THU ==========

const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.count();
        const totalUsers = await User.count({ where: { role: 'customer' } });
        const totalOrders = await Order.count();

        const allOrders = await Order.findAll({ attributes: ['status', 'totalAmount', 'createdAt'] });

        let revenue = { total: 0, thisMonth: 0, lastMonth: 0 };
        let orderByStatus = { NEW: 0, CONFIRMED: 0, PREPARING: 0, SHIPPING: 0, DELIVERED: 0, CANCELLED: 0 };

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        allOrders.forEach(o => {
            const amt = o.totalAmount || 0;
            orderByStatus[o.status] = (orderByStatus[o.status] || 0) + 1;

            if (o.status === 'DELIVERED') {
                revenue.total += amt;
                const d = new Date(o.createdAt);
                if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) revenue.thisMonth += amt;
                if (d.getMonth() === (thisMonth - 1 + 12) % 12 && d.getFullYear() === (thisMonth === 0 ? thisYear - 1 : thisYear)) {
                    revenue.lastMonth += amt;
                }
            }
        });

        // Top 5 sản phẩm bán chạy
        const topProducts = await Product.findAll({
            order: [['soldQuantity', 'DESC']],
            limit: 5,
            attributes: ['id', 'name', 'soldQuantity', 'price', 'image'],
        });

        res.json({ totalProducts, totalUsers, totalOrders, revenue, orderByStatus, topProducts });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = {
    isAdmin,
    // Products
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Orders
    getAllOrders,
    updateOrderStatus,
    // Users
    getAllUsers,
    updateUserRole,
    // Stats
    getDashboardStats,
};
