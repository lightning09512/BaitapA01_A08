const { sequelize, User, Product, Order } = require('../models');

sequelize.authenticate().then(async () => {
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('=== BẢNG TRONG DATABASE ===');
    tables.forEach(t => console.log(' -', Object.values(t)[0]));

    const [cols] = await sequelize.query('SHOW COLUMNS FROM Users');
    console.log('\n=== CỘT TRONG BẢNG Users ===');
    cols.forEach(c => console.log(' -', c.Field, ':', c.Type));

    const pCount = await Product.count();
    const uCount = await User.count();
    const oCount = await Order.count();
    console.log('\n=== SỐ LƯỢNG DỮ LIỆU ===');
    console.log(' Products:', pCount);
    console.log(' Users:', uCount);
    console.log(' Orders:', oCount);

    process.exit(0);
}).catch(e => {
    console.error('Loi:', e.message);
    process.exit(1);
});
