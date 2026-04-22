const { User, Product, Notification, Coupon, Review, Order, OrderItem, UserViewedHistory, Sequelize } = require('../models');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const username = req.user.username;
        const findQuery = userId ? { id: userId } : { username: username };

        const user = await User.findOne({ 
            where: findQuery,
            attributes: { exclude: ['password'] } 
        });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { avatar, name, phone, bio, gender, birthday } = req.body;
        const userId = req.user.id;
        const username = req.user.username;
        const findQuery = userId ? { id: userId } : { username: username };

        const user = await User.findOne({ where: findQuery });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        // Update fields
        if (avatar !== undefined) user.avatar = avatar;
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (gender !== undefined) user.gender = gender;
        if (birthday !== undefined) user.birthday = birthday;
        
        await user.save();
        
        const { password, ...safeUser } = user.toJSON();
        res.json({ message: "Cập nhật hồ sơ thành công", user: safeUser });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getWallet = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username }, include: ['Coupons'] });
        if (!user) return res.status(404).json({ message: "Lỗi user" });

        res.json({
            points: user.points,
            coupons: (user.Coupons || []).filter(c => !c.isUsed)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFavorites = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username }, include: ['Favorites'] });
        if (!user) return res.status(404).json({ message: "Lỗi user" });

        res.json(user.Favorites || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        const product = await Product.findByPk(Number(productId));

        if (!product || !user) return res.status(404).json({ message: "Lỗi dữ liệu" });

        const hasFav = await user.hasFavorite(product);
        let isFavorite = false;

        if (hasFav) {
            await user.removeFavorite(product);
        } else {
            await user.addFavorite(product);
            isFavorite = true;
        }

        // Return list of favorite ids for simple frontend update
        const f = await user.getFavorites({ attributes: ['id'] });
        res.json({ isFavorite, favorites: f.map(x => x.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkFavorite = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        const product = await Product.findByPk(Number(req.params.id));
        if (!user || !product) res.json({ isFavorite: false });
        
        const isFavorite = await user.hasFavorite(product);
        res.json({ isFavorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getViewed = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        if (!user) return res.status(404).json({ message: "Lỗi user" });

        // Fetch products with their view metadata, sorted by absolute sequence ID
        const historySorted = await UserViewedHistory.findAll({
            where: { UserId: user.id },
            include: [{ model: Product, required: true }],
            order: [['id', 'DESC']]
        });

        // Convert to product list, explicitly mapping the sorting just in case
        const viewedProducts = historySorted.map(h => {
            const prod = h.Product.get({ plain: true });
            // Attach the view timestamp if useful for debugging
            prod.viewedAt = h.updatedAt;
            return prod;
        });

        res.json(viewedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification.findAll({
            where: { userId: req.user.username },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const readAllNotifications = async (req, res) => {
    try {
        await Notification.update({ isRead: true }, { where: { userId: req.user.username, isRead: false } });
        res.json({ message: 'Đã đánh dấu đọc tất cả.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reviewProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { rating, comment, orderId } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        
        // Kiểm tra xem đã mua hàng chưa
        const hasBought = await Order.findOne({
            where: { 
                userId: user.id,
                status: 'DELIVERED',
                ...(orderId && { id: orderId })
            },
            include: [{
                model: OrderItem,
                where: { productId, isRated: false }
            }]
        });

        if (!hasBought) {
            return res.status(403).json({ message: "Bạn đã đánh giá sản phẩm này rồi hoặc đơn hàng chưa hoàn tất." });
        }

        // Đánh dấu đã đánh giá trong OrderItem
        if (orderId) {
            await OrderItem.update(
                { isRated: true },
                { where: { orderId, productId } }
            );
        } else {
            // Nếu không có orderId, tìm đơn hàng DELIVERED gần nhất của item này và đánh dấu
            const itemToMark = await OrderItem.findOne({
                where: { productId, isRated: false },
                include: [{
                    model: Order,
                    where: { userId: user.id, status: 'DELIVERED' }
                }]
            });
            if (itemToMark) {
                itemToMark.isRated = true;
                await itemToMark.save();
            }
        }

        const newReview = await Review.create({
            userId: user.id,
            productId,
            username: user.username,
            name: user.name || user.username,
            avatar: user.avatar,
            rating: Number(rating) || 5,
            comment: comment || "",
        });

        user.points += 100;
        
        const newCoupon = await Coupon.create({
            userId: user.id,
            code: 'REVIEW' + Date.now().toString().slice(-4),
            discountPercent: 10,
            description: 'Mã giảm giá 10% từ Đánh giá sản phẩm'
        });

        await user.save();

        await Notification.create({
            id: Date.now().toString(),
            userId: user.username,
            title: 'Đánh giá thành công!',
            message: `Bạn đã được thưởng 100 điểm và 1 mã giảm giá 10% (Mã: ${newCoupon.code}).`
        });

        res.json({ message: "Đánh giá thành công! Bạn được tặng 100 điểm và mã giảm giá 10%", review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: Number(req.params.id) },
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSupportInfo = async (req, res) => {
    try {
        const admin = await User.findOne({ 
            where: { role: 'admin' },
            attributes: ['id', 'username', 'name', 'avatar']
        });
        if (!admin) return res.status(404).json({ message: "Chưa có nhân viên hỗ trợ" });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getSupportInfo,
    getWallet,
    getFavorites,
    toggleFavorite,
    checkFavorite,
    getViewed,
    getNotifications,
    readAllNotifications,
    reviewProduct,
    getProductReviews
};
