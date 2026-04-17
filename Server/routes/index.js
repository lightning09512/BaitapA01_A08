const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, authController.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ---
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-account', authController.verifyAccount);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// --- PROFILE & USER ---
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile/update', authenticateToken, userController.updateAvatar);
router.get('/users/wallet', authenticateToken, userController.getWallet);
router.get('/users/viewed', authenticateToken, userController.getViewed);
router.get('/notifications', authenticateToken, userController.getNotifications);
router.post('/notifications/read-all', authenticateToken, userController.readAllNotifications);

// --- PRODUCTS ---
router.get('/products', productController.getProducts);
router.get('/products/best-selling', productController.getBestSelling);
router.get('/products/by-discount', productController.getByDiscount);
router.get('/categories', productController.getCategories);
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

// --- ORDERS ---
router.post('/orders/checkout-cod', authenticateToken, orderController.checkoutCod);
router.get('/orders', authenticateToken, orderController.getUserOrders);
router.get('/orders/statistics', authenticateToken, orderController.getOrderStatistics);
router.get('/orders/:id', authenticateToken, orderController.getOrderById);
router.post('/orders/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;
