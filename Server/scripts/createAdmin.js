/**
 * Script tạo tài khoản Admin mặc định
 * Chạy: node Server/scripts/createAdmin.js
 */
const { sequelize, User } = require('../models');

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('[INFO] Đã kết nối MySQL');

        const existing = await User.findOne({ where: { username: 'admin' } });
        if (existing) {
            // Nếu đã tồn tại thì cập nhật role và verify
            existing.role = 'admin';
            existing.isVerified = true;
            await existing.save();
            console.log('[SUCCESS] Đã cập nhật tài khoản admin:');
        } else {
            await User.create({
                username: 'admin',
                password: 'admin123',
                email: 'admin@cellphonek.com',
                name: 'Quản trị viên',
                avatar: 'https://i.pravatar.cc/150?img=3',
                isVerified: true,
                role: 'admin',
                points: 0,
            });
            console.log('[SUCCESS] Đã tạo tài khoản admin mới:');
        }

        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   Role:     admin');
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Lỗi:', error.message);
        process.exit(1);
    }
}

createAdmin();
