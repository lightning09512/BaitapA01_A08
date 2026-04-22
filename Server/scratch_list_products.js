const { Product } = require('./models');

async function list() {
  try {
    const products = await Product.findAll({ attributes: ['name'] });
    console.log(JSON.stringify(products.map(p => p.name), null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

list();
