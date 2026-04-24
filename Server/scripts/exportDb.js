const mysqldump = require('mysqldump');
const path = require('path');
const fs = require('fs');

async function exportDatabase() {
    try {
        const dest = path.join(__dirname, '../../cellphonek_database.sql');
        
        console.log('Đang export dữ liệu sang file:', dest);
        
        await mysqldump({
            connection: {
                host: 'localhost',
                user: 'root',
                password: '123456',
                database: 'app_ban_hang_db',
            },
            dumpToFile: dest,
        });

        console.log('[SUCCESS] Đã xuất database thành công!');
        console.log('Bạn có thể tìm file ở:', dest);
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Lỗi khi xuất database:', error.message);
        process.exit(1);
    }
}

exportDatabase();
