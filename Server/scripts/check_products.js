const { Product } = require('../models');

async function checkProducts() {
    try {
        const products = await Product.findAll();
        products.forEach(p => {
            console.log(`ID: ${p.id} | Name: ${p.name} | Image: ${p.image}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkProducts();
