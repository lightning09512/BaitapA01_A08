const { User, Product, Notification, Coupon, Review, Order, OrderItem, Sequelize } = require('../models');

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { username: req.user.username },
            attributes: { exclude: ['password'] } 
        });
        if (!user) return res.status(404).json({ message: "Lỗi user" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAvatar = async (req, res) => {
    try {
        const { avatar } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        if (user) {
            if (avatar) user.avatar = avatar;
            await user.save();
            const { password, ...safeUser } = user.toJSON();
            res.json({ message: "Cập nhật avatar thành công", user: safeUser });
        } else {
            res.status(404).json({ message: "Lỗi user" });
        }
    } catch (error) {
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
        const user = await User.findOne({ 
            where: { username: req.user.username }, 
            include: ['ViewedProducts'] 
        });
        if (!user) return res.status(404).json({ message: "Lỗi user" });
        // The results might not be sorted by viewed time without complex pivot tables but it works.
        res.json(user.ViewedProducts || []);
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
        const { rating, comment } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        
        // Kiểm tra xem đã mua hàng chưa
        const hasBought = await Order.findOne({
            where: { 
                userId: user.id,
                status: 'DELIVERED' // Hoặc có thể dùng { [Sequelize.Op.notIn]: ['CANCELLED'] }
            },
            include: [{
                model: OrderItem,
                where: { productId }
            }]
        });

        if (!hasBought) {
            return res.status(403).json({ message: "Bạn cần mua và nhận thành công sản phẩm này mới có thể đánh giá." });
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

module.exports = {
    getProfile,
    updateAvatar,
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
