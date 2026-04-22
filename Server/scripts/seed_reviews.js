const { Product, User, Review } = require('../models');

const COMMENTS = [
  "Sản phẩm dùng rất tốt, đóng gói cẩn thận.",
  "Giao hàng nhanh, nhân viên thân thiện. Máy dùng mượt.",
  "Hàng chính hãng, bảo hành đầy đủ. Rất hài lòng.",
  "Thiết kế đẹp, cầm chắc tay. Đáng đồng tiền bát gạo.",
  "Chất lượng tuyệt vời, sẽ ủng hộ shop tiếp.",
  "Màu sắc đẹp hơn trong hình, mọi thứ đều ổn.",
  "Máy chạy nhanh, pin ổn định. Hy vọng dùng bền.",
  "Mọi thứ đều ok, từ đóng gói đến quà tặng kèm.",
  "Quá tuyệt vời so với tầm giá. Shop uy tín.",
  "Nhận hàng sau 1 ngày đặt, siêu nhanh luông."
];

const RATINGS = [4, 5, 5, 5, 5]; // Mostly 5 stars

async function seed() {
  try {
    const products = await Product.findAll();
    const users = await User.findAll({ limit: 6 }); // Use first 6 users

    if (products.length === 0 || users.length === 0) {
      console.log('Không có sản phẩm hoặc user để seed.');
      return;
    }

    console.log(`Bắt đầu seed đánh giá cho ${products.length} sản phẩm...`);

    let count = 0;
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 3) + 3; // 3-5 reviews

      for (let i = 0; i < numReviews; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const comment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
        const rating = RATINGS[Math.floor(Math.random() * RATINGS.length)];

        await Review.create({
          productId: product.id,
          userId: user.id,
          username: user.username,
          name: user.name || user.username,
          avatar: user.avatar || 'https://i.pravatar.cc/150?u=' + user.id,
          rating: rating,
          comment: comment
        });
        count++;
      }
    }

    console.log(`Hoàn thành! Đã tạo ${count} đánh giá.`);
  } catch (e) {
    console.error('Seed error:', e);
  } finally {
    process.exit();
  }
}

seed();
