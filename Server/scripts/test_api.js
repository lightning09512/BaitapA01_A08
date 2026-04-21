const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.get('http://localhost:3000/products');
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error('API Error:', e.message);
    }
}

testApi();
