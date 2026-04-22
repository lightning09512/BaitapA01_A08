const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function migratePasswords() {
    console.log('--- Bắt đầu di chuyển mật khẩu sang Bcrypt ---');
    try {
        const users = await User.findAll();
        let migratedCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            // Kiểm tra xem mật khẩu đã được mã hóa chưa bằng Regex
            // Bcrypt hash thường bắt đầu bằng $2a$, $2b$ hoặc $2y$ và có độ dài ổn định
            const isHashed = /^\$2[ayb]\$.{56}$/.test(user.password);

            if (!isHashed) {
                console.log(`Đang mã hóa cho User: ${user.username}...`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Cập nhật trực tiếp vào database
                await User.update(
                    { password: hashedPassword },
                    { where: { id: user.id }, hooks: false } // hooks: false để tránh chạy lại hook trong model (nếu có)
                );
                migratedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log('--- Hoàn tất di chuyển ---');
        console.log(`Thành công: ${migratedCount} người dùng.`);
        console.log(`Bỏ qua (đã mã hóa): ${skippedCount} người dùng.`);
        
        process.exit(0);
    } catch (error) {
        console.error('Lỗi trong quá trình di chuyển:', error);
        process.exit(1);
    }
}

migratePasswords();
