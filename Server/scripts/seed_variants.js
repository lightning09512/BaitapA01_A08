const { Product, ProductVariant } = require('../models');

async function seed() {
  try {
    console.log('Bắt đầu seed biến thể sản phẩm...');

    const products = await Product.findAll();

    for (const product of products) {
      if (product.name.includes('iPhone 15 Pro Max')) {
        await ProductVariant.bulkCreate([
          { productId: product.id, ram: '8GB', rom: '256GB', color: 'Titan Tự Nhiên', price: 29990000, stock: 50 },
          { productId: product.id, ram: '8GB', rom: '512GB', color: 'Titan Tự Nhiên', price: 34990000, stock: 30 },
          { productId: product.id, ram: '8GB', rom: '1TB', color: 'Titan Tự Nhiên', price: 39990000, stock: 10 },
          { productId: product.id, ram: '8GB', rom: '256GB', color: 'Titan Xanh', price: 29990000, stock: 40 }
        ]);
      } else if (product.name.includes('Samsung Galaxy S24 Ultra')) {
        await ProductVariant.bulkCreate([
          { productId: product.id, ram: '12GB', rom: '256GB', color: 'Titan Đen', price: 27990000, stock: 60 },
          { productId: product.id, ram: '12GB', rom: '512GB', color: 'Titan Đen', price: 30990000, stock: 40 },
          { productId: product.id, ram: '12GB', rom: '1TB', color: 'Titan Đen', price: 34990000, stock: 15 }
        ]);
      } else if (product.name.includes('MacBook Air M3')) {
        await ProductVariant.bulkCreate([
          { productId: product.id, ram: '8GB', rom: '256GB', color: 'Starlight', price: 27990000, stock: 25 },
          { productId: product.id, ram: '16GB', rom: '256GB', color: 'Starlight', price: 32990000, stock: 20 },
          { productId: product.id, ram: '16GB', rom: '512GB', color: 'Starlight', price: 37990000, stock: 15 }
        ]);
      } else if (product.category === 'Phone' || product.category === 'Laptop') {
        // Generic variants for other phones/laptops
        await ProductVariant.bulkCreate([
          { productId: product.id, ram: '8GB', rom: '128GB', color: 'Mặc định', price: product.price, stock: 100 },
          { productId: product.id, ram: '8GB', rom: '256GB', color: 'Mặc định', price: product.price + 2000000, stock: 50 }
        ]);
      }
    }

    console.log('Hoàn thành seed biến thể!');
  } catch (e) {
    console.error('Seed variants error:', e);
  } finally {
    process.exit();
  }
}

seed();
