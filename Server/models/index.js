const { DataTypes, Op, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    avatar: { type: DataTypes.TEXT('long') },
    bio: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    birthday: { type: DataTypes.STRING },
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
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    category: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    soldQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    discountPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT('long') },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ram: { type: DataTypes.STRING },      // e.g. "8GB", "12GB"
    rom: { type: DataTypes.STRING },      // e.g. "256GB", "512GB"
    color: { type: DataTypes.STRING },    // e.g. "Titan Natural"
    price: { type: DataTypes.DOUBLE },    // Specific price for this variant
    stock: { type: DataTypes.INTEGER, defaultValue: 20 },
});

const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    avatar: { type: DataTypes.TEXT('long') },
    rating: { type: DataTypes.INTEGER, defaultValue: 5 },
    comment: { type: DataTypes.TEXT },
});

// Quan hệ User - Review
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Quan hệ Product - Review
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// Quan hệ Product - ProductVariant
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'Variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

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
    image: { type: DataTypes.TEXT('long') },
    unitPrice: { type: DataTypes.DOUBLE },
    quantity: { type: DataTypes.INTEGER },
    lineTotal: { type: DataTypes.DOUBLE },
    isRated: { type: DataTypes.BOOLEAN, defaultValue: false },
    variantId: { type: DataTypes.INTEGER },           // Link optionally to variant
    variantInfo: { type: DataTypes.STRING },         // Store string info for history
});

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    variantId: { type: DataTypes.INTEGER }, // Optional link to specific variant
});

User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(CartItem, { foreignKey: 'variantId' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

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
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.belongsToMany(Product, { through: UserViewedHistory, as: 'ViewedProducts' });
Product.belongsToMany(User, { through: UserViewedHistory });

// Individual associations for direct sorting
UserViewedHistory.belongsTo(User, { foreignKey: 'UserId' });
UserViewedHistory.belongsTo(Product, { foreignKey: 'ProductId' });

const ChatMessage = sequelize.define('ChatMessage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasMany(ChatMessage, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(ChatMessage, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
ChatMessage.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

module.exports = {
    sequelize,
    Sequelize,
    Op,
    User,
    Product,
    Review,
    Order,
    OrderItem,
    CartItem,
    ProductVariant,
    Coupon,
    Notification,
    UserFavorites,
    UserViewedHistory,
    ChatMessage
};
