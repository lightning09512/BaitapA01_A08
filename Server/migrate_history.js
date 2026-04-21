const { sequelize } = require('./config/database');

async function migrate() {
    try {
        console.log('--- ĐANG CHẠY MIGRATION CHO BẢNG LỊCH SỬ XEM ---');

        // 1. Xoá khoá chính cũ (UserId, ProductId)
        try {
            await sequelize.query("ALTER TABLE userviewedhistories DROP PRIMARY KEY");
            console.log('- Đã xoá khoá chính cũ.');
        } catch (e) {
            console.log('- Không tìm thấy khoá chính cũ hoặc đã xoá rồi.');
        }

        // 2. Thêm cột id tự tăng làm khoá chính mới
        await sequelize.query("ALTER TABLE userviewedhistories ADD COLUMN id INT PRIMARY KEY AUTO_INCREMENT FIRST");
        console.log('- Đã thêm cột id và thiết lập khoá chính mới.');

        console.log('--- MIGRATION HOÀN TẤT THÀNH CÔNG ---');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi chạy migration:', error.message);
        
        // Trình tự dự phòng: Nếu lỗi, thử xoá bảng và tạo lại (vì đây là bảng lịch sử, dữ liệu có thể reset)
        try {
            console.log('- Đang thử cách dự phòng: Xoá bảng và tạo lại...');
            await sequelize.query("DROP TABLE IF EXISTS userviewedhistories");
            console.log('- Đã xoá bảng. Sequelize sync sẽ tự tạo lại với cấu trúc mới khi khởi động server.');
            process.exit(0);
        } catch (e2) {
            console.error('Lỗi nghiêm trọng:', e2.message);
            process.exit(1);
        }
    }
}

migrate();
