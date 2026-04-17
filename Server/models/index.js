const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verifyOtp: { type: DataTypes.STRING },
    resetOtp: { type: DataTypes.STRING },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    role: { type: DataTypes.STRING, defaultValue: 'customer' }, // 'customer' | 'admin'
    // Các field phụ
    tempEmail: { type: DataTypes.STRING },
    otp: { type: DataTypes.STRING },
    tempPhone: { type: DataTypes.STRING },
    tempName: { type: DataTypes.STRING },
    otpPhone: { type: DataTypes.STRING },
});

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    category: { type: DataTypes.STRING },
    soldQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    discountPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
    rating: { type: DataTypes.INTEGER, defaultValue: 5 },
    comment: { type: DataTypes.TEXT },
});

// Quan hệ User - Review
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Quan hệ Product - Review
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

const Order = sequelize.define('Order', {
    id: { type: DataTypes.STRING, primaryKey: true }, // Dùng chuỗi Timestamp làm mã như cũ
    status: { type: DataTypes.STRING, defaultValue: 'NEW' },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'COD' },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    note: { type: DataTypes.TEXT },
    subTotal: { type: DataTypes.DOUBLE },
    discountAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
    totalAmount: { type: DataTypes.DOUBLE },
    usedCoupon: { type: DataTypes.STRING },
    usedPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
    cancelRequested: { type: DataTypes.BOOLEAN, defaultValue: false },
    confirmedAt: { type: DataTypes.DATE },
    cancelledAt: { type: DataTypes.DATE },
});

// User - Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    image: { type: DataTypes.TEXT },
    unitPrice: { type: DataTypes.DOUBLE },
    quantity: { type: DataTypes.INTEGER },
    lineTotal: { type: DataTypes.DOUBLE },
});

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true },
    discountPercent: { type: DataTypes.INTEGER },
    isUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
    description: { type: DataTypes.STRING },
});

User.hasMany(Coupon, { foreignKey: 'userId' });
Coupon.belongsTo(User, { foreignKey: 'userId' });

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.STRING, primaryKey: true },
    title: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasMany(Notification, { foreignKey: 'userId', sourceKey: 'username' }); 
// Có thể liên kết bằng username vì cũ code dùng username

// Bảng trung gian
const UserFavorites = sequelize.define('UserFavorites', {
    // bảng tự động tạo 2 cột userId và productId
});

User.belongsToMany(Product, { through: UserFavorites, as: 'Favorites' });
Product.belongsToMany(User, { through: UserFavorites });

const UserViewedHistory = sequelize.define('UserViewedHistory', {
    // bảng này để lưu lịch sử viewed
});

User.belongsToMany(Product, { through: UserViewedHistory, as: 'ViewedProducts' });
Product.belongsToMany(User, { through: UserViewedHistory });

module.exports = {
    sequelize,
    User,
    Product,
    Review,
    Order,
    OrderItem,
    CartItem,
    Coupon,
    Notification,
    UserFavorites,
    UserViewedHistory
};
