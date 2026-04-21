const { Product } = require('./models');

async function fixData() {
    try {
        console.log('--- ĐANG SỬA LỖI DỮ LIỆU SẢN PHẨM ---');

        // Fix Pixel 8 Pro (Which was ID 1 and misnamed)
        await Product.update(
            { name: 'Google Pixel 8 Pro', brand: 'Google' },
            { where: { id: 1 } }
        );
        console.log('- Đã sửa ID 1 thành Google Pixel 8 Pro');

        // Fix Xiaomi 14 Ultra (Which was ID 7 but had a laptop image)
        await Product.update(
            { 
                name: 'ASUS ROG Zephyrus G14', 
                brand: 'ASUS', 
                category: 'Laptop',
                description: 'Laptop gaming siêu mỏng nhẹ, màn hình ROG Nebula OLED, AMD Ryzen 8000 series.'
            },
            { where: { id: 7 } }
        );
        console.log('- Đã sửa ID 7 thành ASUS ROG Zephyrus G14 (vì ảnh là Laptop)');

        // Fix another Xiaomi instance if needed or just add a real Xiaomi
        await Product.create({
            name: 'Xiaomi 14 Ultra',
            price: 24990000,
            brand: 'Xiaomi',
            category: 'Phone',
            description: 'Camera Leica 50MP, Snapdragon 8 Gen 3, Màn hình AMOLED 6.73 inch 2K.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQghzo0iEbE16bjUpunNA-dCSFXRk6-rhEC_w&s',
            soldQuantity: 120,
            discountPercent: 5
        });
        console.log('- Đã tạo thêm bản ghi Xiaomi 14 Ultra đúng nghĩa');

        console.log('--- HOÀN TẤT ---');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi sửa dữ liệu:', error);
        process.exit(1);
    }
}

fixData();
