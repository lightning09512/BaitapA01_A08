const axios = require('axios');
const { Product } = require('../models');

async function checkUrls() {
    try {
        const products = await Product.findAll();
        for (const p of products) {
            try {
                const res = await axios.head(p.image, { timeout: 5000 });
                console.log(`ID ${p.id}: OK (${res.status}) - ${p.name}`);
            } catch (e) {
                console.log(`ID ${p.id}: FAILED (${e.message}) - ${p.name} - ${p.image}`);
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkUrls();
