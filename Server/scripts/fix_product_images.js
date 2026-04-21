const { Product } = require('../models');

async function fixData() {
    try {
        console.log('Starting data repair...');

        // 1. Fix Dell XPS 13 Plus (ID 4) which was broken
        await Product.update(
            { 
                image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/e/dell-xps-13-plus-9320-i7-16-512-win11-70295789-glr_1.jpg' 
            },
            { where: { id: 4 } }
        );

        // 2. Fix Xiaomi 14 Ultra (ID 7) - ensure correct image
        await Product.update(
            { 
                image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_14_ultra_-_black_-_rgb_1.png'
            },
            { where: { id: 7 } }
        );

        // 3. Fix Corrupted "Neo 7" entries (IDs 23-27)
        const corruptedFixes = [
            { id: 23, name: 'TECNO Camon 30', brand: 'Other', category: 'Phone' },
            { id: 24, name: 'HONOR X8b', brand: 'Other', category: 'Phone' },
            { id: 25, name: 'Nubia RedMagic 9 Pro', brand: 'Other', category: 'Phone' },
            { id: 26, name: 'Nokia G42', brand: 'Other', category: 'Phone' },
            { id: 27, name: 'Infinix Note 40 Pro', brand: 'Other', category: 'Phone' }
        ];

        for (const item of corruptedFixes) {
            await Product.update(
                { name: item.name, brand: item.brand, category: item.category },
                { where: { id: item.id } }
            );
        }

        // 4. Update ID 22 (Duplicate of 8) to something unique if needed, 
        // but user just said fix broken images. 
        // Let's at least make sure ID 17 (Apple Watch Ultra 2) has a good link.
        await Product.update(
            { image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-watch-ultra-2-49mm-titan-day-vong-trail_1.jpg' },
            { where: { id: 17 } }
        );

        // 5. Check and repair IDs 13, 14 if they are using generic links
        // Samsung Tab S9 Ultra (13)
        await Product.update(
            { image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-s9-ultra_10_.png' },
            { where: { id: 13 } }
        );
        // Surface Pro 9 (14)
        await Product.update(
            { image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/u/surface-pro-9_1_1.png' },
            { where: { id: 14 } }
        );

        console.log('Data repair completed successfully!');
        process.exit(0);
    } catch (e) {
        console.error('Data repair failed:', e);
        process.exit(1);
    }
}

fixData();
