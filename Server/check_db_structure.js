const { sequelize } = require('./config/database');

async function checkTable() {
    try {
        const [results] = await sequelize.query("DESCRIBE userviewedhistories");
        console.log('--- Cấu trúc bảng userviewedhistories ---');
        console.table(results);
        
        const [indexes] = await sequelize.query("SHOW INDEX FROM userviewedhistories");
        console.log('--- Các Index hiện có ---');
        console.table(indexes);
        
        process.exit(0);
    } catch (e) {
        console.error('Lỗi khi kiểm tra bảng:', e);
        process.exit(1);
    }
}

checkTable();
