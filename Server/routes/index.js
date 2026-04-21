const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const chatController = require('../controllers/chatController');

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, authController.SECRET_KEY, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;

        // Lấy role từ DB để phân quyền chính xác
        try {
            const { User } = require('../models');
            const user = await User.findOne({ where: { username: decoded.username }, attributes: ['role'] });
            req.userRole = user ? user.role : 'customer';
        } catch {
            req.userRole = 'customer';
        }
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng Admin.' });
    }
    next();
};

// --- AUTH ---
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-account', authController.verifyAccount);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// --- PROFILE & USER ---
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile/update', authenticateToken, userController.updateProfile);
router.get('/support-info', authenticateToken, userController.getSupportInfo);
router.get('/users/wallet', authenticateToken, userController.getWallet);
router.get('/users/viewed', authenticateToken, userController.getViewed);
router.get('/notifications', authenticateToken, userController.getNotifications);
router.post('/notifications/read-all', authenticateToken, userController.readAllNotifications);

// --- PRODUCTS (public read, admin write) ---
router.get('/products', productController.getProducts);
router.get('/products/best-selling', productController.getBestSelling);
router.get('/products/by-discount', productController.getByDiscount);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/products/:id', productController.getProductById);
router.post('/products/:id/view', authenticateToken, productController.viewProduct);
router.get('/products/:id/similar', productController.getSimilar);

// --- REVIEWS ---
router.get('/products/:id/reviews', userController.getProductReviews);
router.post('/products/:id/reviews', authenticateToken, userController.reviewProduct);

// --- FAVORITES ---
router.get('/favorites', authenticateToken, userController.getFavorites);
router.post('/favorites/toggle', authenticateToken, userController.toggleFavorite);
router.get('/favorites/check/:id', authenticateToken, userController.checkFavorite);

// --- CART ---
router.get('/cart', authenticateToken, cartController.getCart);
router.post('/cart/add', authenticateToken, cartController.addToCart);
router.put('/cart/update', authenticateToken, cartController.updateCart);
router.post('/cart/remove', authenticateToken, cartController.removeFromCart);
router.post('/cart/clear', authenticateToken, cartController.clearCart);

// --- CHAT ---
router.get('/chat/history/:targetId', authenticateToken, chatController.getChatHistory);
router.get('/admin/chat/conversations', authenticateToken, requireAdmin, chatController.getAdminConversations);

// --- ORDERS (customer) ---
router.post('/orders/checkout-cod', authenticateToken, orderController.checkoutCod);
router.get('/orders/statistics', authenticateToken, orderController.getOrderStatistics);
router.get('/orders', authenticateToken, orderController.getUserOrders);
router.get('/orders/:id', authenticateToken, orderController.getOrderById);
router.post('/orders/cancel', authenticateToken, orderController.cancelOrder);

// ============ ADMIN ROUTES ============
// Tất cả route /admin/* yêu cầu token + role admin
router.get('/admin/dashboard', authenticateToken, requireAdmin, adminController.getDashboardStats);

// Admin quản lý sản phẩm
router.get('/admin/products', authenticateToken, requireAdmin, adminController.getAllProducts);
router.post('/admin/products', authenticateToken, requireAdmin, adminController.createProduct);
router.put('/admin/products/:id', authenticateToken, requireAdmin, adminController.updateProduct);
router.delete('/admin/products/:id', authenticateToken, requireAdmin, adminController.deleteProduct);

// Admin quản lý đơn hàng
router.get('/admin/orders', authenticateToken, requireAdmin, adminController.getAllOrders);
router.post('/admin/orders/status', authenticateToken, requireAdmin, adminController.updateOrderStatus);

// Admin quản lý người dùng
router.get('/admin/users', authenticateToken, requireAdmin, adminController.getAllUsers);
router.post('/admin/users/role', authenticateToken, requireAdmin, adminController.updateUserRole);
router.delete('/admin/users/:userId', authenticateToken, requireAdmin, adminController.deleteUser);

module.exports = router;
