const { Sequelize } = require('sequelize');

// Thiết lập kết nối đến MySQL sử dụng Sequelize
const sequelize = new Sequelize('app_ban_hang_db', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log để xem raw SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối đến MySQL (app_ban_hang_db) thành công.');
    } catch (error) {
        console.error('❌ Không thể kết nối tới MySQL:', error);
    }
};

module.exports = { sequelize, connectDB };
