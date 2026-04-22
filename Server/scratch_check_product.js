const { Product, ProductVariant } = require('./models');

async function check() {
  try {
    const product = await Product.findByPk(1, {
        include: [{ model: ProductVariant, as: 'Variants' }]
    });
    console.log(JSON.stringify(product, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

check();
