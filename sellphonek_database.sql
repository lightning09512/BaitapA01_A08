/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cartitems
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_4` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: coupons
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `discountPercent` int DEFAULT NULL,
  `isUsed` tinyint(1) DEFAULT '0',
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  KEY `userId` (`userId`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: notifications
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: orderitems
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `image` text,
  `unitPrice` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `lineTotal` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `orderId` varchar(255) DEFAULT NULL,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_4` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_5` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: orders
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'NEW',
  `paymentMethod` varchar(255) DEFAULT 'COD',
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `note` text,
  `subTotal` double DEFAULT NULL,
  `discountAmount` double DEFAULT '0',
  `totalAmount` double DEFAULT NULL,
  `usedCoupon` varchar(255) DEFAULT NULL,
  `usedPoints` int DEFAULT '0',
  `cancelRequested` tinyint(1) DEFAULT '0',
  `confirmedAt` datetime DEFAULT NULL,
  `cancelledAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: products
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `soldQuantity` int DEFAULT '0',
  `discountPercent` int DEFAULT '0',
  `description` text,
  `image` text,
  `viewCount` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: reviews
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT '5',
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: userfavorites
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userfavorites` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int NOT NULL,
  `ProductId` int NOT NULL,
  PRIMARY KEY (`UserId`, `ProductId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `userfavorites_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userfavorites_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `verifyOtp` varchar(255) DEFAULT NULL,
  `resetOtp` varchar(255) DEFAULT NULL,
  `points` int DEFAULT '0',
  `tempEmail` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `tempPhone` varchar(255) DEFAULT NULL,
  `tempName` varchar(255) DEFAULT NULL,
  `otpPhone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role` varchar(255) DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: userviewedhistories
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userviewedhistories` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int NOT NULL,
  `ProductId` int NOT NULL,
  PRIMARY KEY (`UserId`, `ProductId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `userviewedhistories_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cartitems
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: coupons
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: notifications
# ------------------------------------------------------------

INSERT INTO
  `notifications` (
    `id`,
    `title`,
    `message`,
    `isRead`,
    `createdAt`,
    `updatedAt`,
    `userId`
  )
VALUES
  (
    '1776401195830',
    'Đặt hàng thành công!',
    'Đơn hàng mới với tổng tiền 28,990,000đ đã được đặt thành công.',
    1,
    '2026-04-17 04:46:35',
    '2026-04-17 04:48:10',
    'khanhdeptrai'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: orderitems
# ------------------------------------------------------------

INSERT INTO
  `orderitems` (
    `id`,
    `name`,
    `image`,
    `unitPrice`,
    `quantity`,
    `lineTotal`,
    `createdAt`,
    `updatedAt`,
    `orderId`,
    `productId`
  )
VALUES
  (
    1,
    'iPad Pro M4 11 inch',
    'https://cdn.tgdd.vn/Products/Images/522/325513/ipad-pro-11-inch-m4-wifi-sliver-1-750x500.jpg',
    28990000,
    1,
    28990000,
    '2026-04-17 04:46:35',
    '2026-04-17 04:46:35',
    '1776401195810',
    6
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: orders
# ------------------------------------------------------------

INSERT INTO
  `orders` (
    `id`,
    `status`,
    `paymentMethod`,
    `address`,
    `phone`,
    `note`,
    `subTotal`,
    `discountAmount`,
    `totalAmount`,
    `usedCoupon`,
    `usedPoints`,
    `cancelRequested`,
    `confirmedAt`,
    `cancelledAt`,
    `createdAt`,
    `updatedAt`,
    `userId`
  )
VALUES
  (
    '1776401195810',
    'NEW',
    'COD',
    'Idhfjcicc',
    '0395990338',
    'Jdjdid8ude',
    28990000,
    0,
    28990000,
    NULL,
    0,
    0,
    NULL,
    NULL,
    '2026-04-17 04:46:35',
    '2026-04-17 04:46:35',
    4
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: products
# ------------------------------------------------------------

INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'iPhone 15 Pro Max',
    34990000,
    'Phone',
    4200,
    5,
    'Titan tự nhiên, 256GB, Chip A17 Pro mạnh mẽ nhất. Màn hình Super Retina XDR 6.7 inch, Camera 48MP với zoom quang học 5x.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH8boYZTiYz5boNoOG3-NkB8W-0i4BXFBlrw&s',
    1,
    '2026-04-16 11:59:25',
    '2026-04-17 04:46:08'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'Samsung Galaxy S24 Ultra',
    33990000,
    'Phone',
    3800,
    8,
    'Quyền năng AI, Camera 200MP, Snap 8 Gen 3. Màn hình Dynamic AMOLED 2X 6.8 inch, S Pen tích hợp.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSI9OihvPcEuLhhnO9aV7hjjwQjOy-P8UgKQ&s',
    4,
    '2026-04-16 11:59:25',
    '2026-04-17 05:15:21'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'MacBook Air M3 13 inch',
    27990000,
    'Laptop',
    3500,
    3,
    'Mỏng nhẹ, Chip M3, Pin 18 tiếng. Màn hình Retina 13.6 inch, 8GB RAM, 256GB SSD. Thiết kế siêu mỏng chỉ 1.24cm.',
    'https://cdn2.fptshop.com.vn/unsafe/macbook_air_13_m2_midnight_1_35053fbcf9.png',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'Dell XPS 13 Plus',
    45000000,
    'Laptop',
    890,
    7,
    'Thiết kế tương lai, màn hình OLED 3.5K 13.4 inch, Intel Core i7 gen 13, 16GB RAM, 512GB SSD.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s',
    2,
    '2026-04-16 11:59:25',
    '2026-04-17 05:06:24'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'Sony WH-1000XM5',
    6490000,
    'Accessory',
    5100,
    10,
    'Tai nghe chống ồn tốt nhất thế giới. Chống ồn chủ động, Pin 30 giờ, Sạc nhanh 3 phút dùng 3 giờ, Chất lượng âm thanh Hi-Res.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6BWGZyqSmuqISxAlMaC4-ZB6O_N9B1e9dwA&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'iPad Pro M4 11 inch',
    28990000,
    'Tablet',
    2800,
    2,
    'Màn hình Ultra Retina XDR, mỏng nhất Apple. Chip M4 mạnh mẽ, Camera 12MP, Hỗ trợ Apple Pencil và Magic Keyboard.',
    'https://cdn.tgdd.vn/Products/Images/522/325513/ipad-pro-11-inch-m4-wifi-sliver-1-750x500.jpg',
    3,
    '2026-04-16 11:59:25',
    '2026-04-17 04:46:12'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'Xiaomi 14 Ultra',
    24990000,
    'Phone',
    2100,
    12,
    'Camera Leica 50MP, Snapdragon 8 Gen 3, Màn hình AMOLED 6.73 inch 2K, Pin 5300mAh sạc nhanh 90W.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQghzo0iEbE16bjUpunNA-dCSFXRk6-rhEC_w&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'OPPO Find X7 Ultra',
    26990000,
    'Phone',
    1800,
    10,
    'Camera 50MP kép, Snapdragon 8 Gen 3, Màn hình LTPO 6.82 inch, Sạc nhanh 100W SuperVOOC.',
    'https://cdn.viettablet.com/images/detailed/59/oppo-find-x7-ultra-1.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    'Google Pixel 8 Pro',
    22990000,
    'Phone',
    1500,
    15,
    'Camera 50MP với AI, Tensor G3, Màn hình OLED 6.7 inch, Magic Eraser và các tính năng AI độc đáo.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxSBtRHHdVQB_T2ZOeNUiRh0dTL7q7mSW-Ng&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    10,
    'ASUS ROG Zephyrus G16',
    42990000,
    'Laptop',
    2200,
    6,
    'Gaming laptop mạnh mẽ, RTX 4060, Intel Core i9, Màn hình 16 inch 165Hz, 16GB RAM, 1TB SSD.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-FPlsI-qhjGQomKf0ODIRhSqmjJwyrrTwQ&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    11,
    'Lenovo ThinkPad X1 Carbon',
    38990000,
    'Laptop',
    1650,
    4,
    'Laptop doanh nhân cao cấp, Intel Core i7, Màn hình 14 inch 2.8K, 16GB RAM, 512GB SSD, Bàn phím ThinkPad huyền thoại.',
    'https://ttcenter.com.vn/uploads/product/a7gv07yw-935-thinkpad-x1-carbon-gen-8-i7-16gb-512gb-2k-99.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    12,
    'HP Spectre x360 14',
    34990000,
    'Laptop',
    1200,
    9,
    'Laptop 2-in-1 cao cấp, Intel Core i7, Màn hình OLED 14 inch cảm ứng, 16GB RAM, 512GB SSD, Xoay 360 độ.',
    'https://anphat.com.vn/media/product/49108_laptop_hp_spectre_x360_14_eu0050tu_a19blpa___1_.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    13,
    'Samsung Galaxy Tab S9 Ultra',
    24990000,
    'Tablet',
    1400,
    11,
    'Tablet Android cao cấp, Màn hình Super AMOLED 14.6 inch, Snapdragon 8 Gen 2, S Pen tích hợp, 12GB RAM, 256GB.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    14,
    'Microsoft Surface Pro 9',
    31990000,
    'Tablet',
    950,
    14,
    'Tablet Windows 2-in-1, Intel Core i7, Màn hình 13 inch PixelSense, Surface Pen và Type Cover tùy chọn.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT-FPlsI-qhjGQomKf0ODIRhSqmjJwyrrTwQ&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    15,
    'iPad Air M2 11 inch',
    19990000,
    'Tablet',
    3100,
    5,
    'iPad Air thế hệ mới, Chip M2, Màn hình Liquid Retina 11 inch, Camera 12MP, Hỗ trợ Apple Pencil 2.',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-11-wifi-1.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    16,
    'AirPods Pro 2',
    5990000,
    'Accessory',
    4800,
    8,
    'Tai nghe không dây Apple, Chống ồn chủ động, Spatial Audio, Pin 6 giờ + case 30 giờ, MagSafe charging.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfgGOqWWb6x7wV8I8N9MD1jx-dWc9OrKh8w&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    17,
    'Apple Watch Ultra 2',
    18990000,
    'Accessory',
    1900,
    4,
    'Đồng hồ thông minh cao cấp, Màn hình 49mm, Pin 36 giờ, Chống nước 100m, GPS kép, Titanium case.',
    'https://bvtmobile.com/uploads/source/apw-ultra-2024/ocean-orange.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    18,
    'Samsung Galaxy Watch 6 Classic',
    8990000,
    'Accessory',
    2600,
    18,
    'Đồng hồ thông minh Android, Màn hình 47mm, Vòng bezel xoay, Pin 2 ngày, Đo huyết áp, ECG.',
    'https://cdn.tgdd.vn/Products/Images/7077/310858/samsung-galaxy-watch6-classic-47mm-bac-1-750x500.png',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    19,
    'Logitech MX Master 3S',
    2490000,
    'Accessory',
    4200,
    20,
    'Chuột không dây cao cấp, Cảm biến Darkfield 8000 DPI, Pin 70 ngày, Kết nối đa thiết bị, Scroll wheel MagSpeed.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi8cc40trQNmJwSLANlBbwBdz2wHuqIM42ag&s',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );
INSERT INTO
  `products` (
    `id`,
    `name`,
    `price`,
    `category`,
    `soldQuantity`,
    `discountPercent`,
    `description`,
    `image`,
    `viewCount`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    20,
    'Magic Keyboard iPad Pro',
    3990000,
    'Accessory',
    1100,
    15,
    'Bàn phím Apple cho iPad Pro, Thiết kế gập, Trackpad tích hợp, Pin sạc qua Smart Connector, Backlit keys.',
    'https://cdn2.cellphones.com.vn/x/media/catalog/product/b/a/ban-phim-apple-magic-keyboard-ipad-pro-13-inch-m4_1.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reviews
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: userfavorites
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `username`,
    `password`,
    `email`,
    `name`,
    `phone`,
    `avatar`,
    `isVerified`,
    `verifyOtp`,
    `resetOtp`,
    `points`,
    `tempEmail`,
    `otp`,
    `tempPhone`,
    `tempName`,
    `otpPhone`,
    `createdAt`,
    `updatedAt`,
    `role`
  )
VALUES
  (
    1,
    'admin',
    'admin123',
    'admin@test.com',
    'Admin User',
    '0909000111',
    'https://i.pravatar.cc/150?img=3',
    1,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-16 11:59:25',
    '2026-04-17 05:07:33',
    'admin'
  );
INSERT INTO
  `users` (
    `id`,
    `username`,
    `password`,
    `email`,
    `name`,
    `phone`,
    `avatar`,
    `isVerified`,
    `verifyOtp`,
    `resetOtp`,
    `points`,
    `tempEmail`,
    `otp`,
    `tempPhone`,
    `tempName`,
    `otpPhone`,
    `createdAt`,
    `updatedAt`,
    `role`
  )
VALUES
  (
    2,
    'khanh123',
    '123456',
    'khanh1@gmail.com',
    'Người dùng mới',
    '',
    'https://i.pravatar.cc/150?img=12',
    0,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25',
    'customer'
  );
INSERT INTO
  `users` (
    `id`,
    `username`,
    `password`,
    `email`,
    `name`,
    `phone`,
    `avatar`,
    `isVerified`,
    `verifyOtp`,
    `resetOtp`,
    `points`,
    `tempEmail`,
    `otp`,
    `tempPhone`,
    `tempName`,
    `otpPhone`,
    `createdAt`,
    `updatedAt`,
    `role`
  )
VALUES
  (
    3,
    'Kkkkk095',
    'k11145095',
    'kkkkk@gmail.com',
    'Người dùng mới',
    '',
    'https://i.pravatar.cc/150?img=12',
    1,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-16 11:59:25',
    '2026-04-16 11:59:25',
    'customer'
  );
INSERT INTO
  `users` (
    `id`,
    `username`,
    `password`,
    `email`,
    `name`,
    `phone`,
    `avatar`,
    `isVerified`,
    `verifyOtp`,
    `resetOtp`,
    `points`,
    `tempEmail`,
    `otp`,
    `tempPhone`,
    `tempName`,
    `otpPhone`,
    `createdAt`,
    `updatedAt`,
    `role`
  )
VALUES
  (
    4,
    'khanhdeptrai',
    '123456',
    'khanhdeptrai@gmail.com',
    NULL,
    NULL,
    'https://i.pravatar.cc/150?img=12',
    1,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-16 15:44:09',
    '2026-04-16 15:44:20',
    'customer'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: userviewedhistories
# ------------------------------------------------------------

INSERT INTO
  `userviewedhistories` (`createdAt`, `updatedAt`, `UserId`, `ProductId`)
VALUES
  ('2026-04-17 04:46:08', '2026-04-17 04:46:08', 4, 1);
INSERT INTO
  `userviewedhistories` (`createdAt`, `updatedAt`, `UserId`, `ProductId`)
VALUES
  ('2026-04-17 05:15:21', '2026-04-17 05:15:21', 4, 2);
INSERT INTO
  `userviewedhistories` (`createdAt`, `updatedAt`, `UserId`, `ProductId`)
VALUES
  ('2026-04-17 05:06:24', '2026-04-17 05:06:24', 4, 4);
INSERT INTO
  `userviewedhistories` (`createdAt`, `updatedAt`, `UserId`, `ProductId`)
VALUES
  ('2026-04-17 04:46:12', '2026-04-17 04:46:12', 4, 6);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
