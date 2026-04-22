const { Order, OrderItem, User } = require('./models');

async function check() {
    try {
        const orders = await Order.findAll({
            include: [OrderItem]
        });
        console.log('--- ORDERS ---');
        orders.forEach(o => {
            console.log(`ID: ${o.id}, Status: ${o.status}, UserId: ${o.userId}`);
            o.OrderItems.forEach(oi => {
                console.log(`  Item: ${oi.name}, ProdID: ${oi.productId}`);
            });
        });

        const users = await User.findAll({ attributes: ['id', 'username'] });
        console.log('--- USERS ---');
        console.log(users.map(u => ({ id: u.id, username: u.username })));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
