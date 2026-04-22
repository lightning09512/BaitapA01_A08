const { OrderItem } = require('./models');

async function check() {
    try {
        const items = await OrderItem.findAll();
        console.log('--- ORDER ITEMS ---');
        items.forEach(oi => {
            console.log(`Order: ${oi.orderId}, Product: ${oi.productId}, Name: ${oi.name}, isRated: ${oi.isRated}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
