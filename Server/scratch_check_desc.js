const { Product } = require('./models');

async function check() {
    try {
        const product = await Product.findOne({ where: { category: 'Phone' } });
        if (product) {
            console.log('--- PRODUCT: ' + product.name + ' ---');
            console.log(product.description);
        } else {
            console.log('No products found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
