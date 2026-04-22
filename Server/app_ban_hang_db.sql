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
  CONSTRAINT `cartitems_ibfk_10` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_12` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_14` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_16` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_18` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_20` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_22` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_24` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_26` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_28` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_30` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_32` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_34` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_36` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_38` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_4` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_40` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_42` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_44` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_46` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_8` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: chatmessages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `chatmessages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int NOT NULL,
  `receiverId` int NOT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `chatmessages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_10` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_11` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_12` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_13` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_14` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_15` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_16` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_17` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_18` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_3` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_4` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_5` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_6` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_7` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_8` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chatmessages_ibfk_9` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  KEY `userId` (`userId`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `coupons_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  CONSTRAINT `notifications_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`username`) ON DELETE
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
  CONSTRAINT `orderitems_ibfk_10` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_11` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_12` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_13` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_14` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_15` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_16` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_17` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_18` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_19` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_20` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_21` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_22` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_23` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_24` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_25` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_26` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_27` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_28` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_29` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_30` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_31` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_32` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_33` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_34` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_35` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_36` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_37` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_38` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_39` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_4` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_40` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_41` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_42` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_43` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_44` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_45` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_46` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_5` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_7` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_8` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_9` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  CONSTRAINT `orders_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
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
  `brand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 28 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: reviews
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar` text,
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
  CONSTRAINT `reviews_ibfk_10` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_12` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_14` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_16` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_18` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_20` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_22` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_24` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_26` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_28` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_30` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_32` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_34` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_36` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_38` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_40` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_42` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_44` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_46` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_8` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `avatar` text,
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
  `bio` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `email_23` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: userviewedhistories
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userviewedhistories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL,
  `ProductId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserViewedHistories_ProductId_UserId_unique` (`UserId`, `ProductId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `userviewedhistories_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_10` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_11` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_12` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_13` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_14` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_15` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_16` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_17` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_18` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_19` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_20` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_21` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_22` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_23` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_24` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_25` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_26` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_4` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_6` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_8` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userviewedhistories_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 36 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cartitems
# ------------------------------------------------------------

INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    4,
    3,
    '2026-04-17 05:43:21',
    '2026-04-18 06:57:24',
    4,
    4
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    5,
    1,
    '2026-04-17 05:47:46',
    '2026-04-17 05:47:46',
    4,
    6
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    6,
    3,
    '2026-04-17 05:47:54',
    '2026-04-18 07:09:17',
    4,
    1
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    7,
    2,
    '2026-04-18 07:05:49',
    '2026-04-18 07:05:51',
    4,
    10
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    13,
    1,
    '2026-04-20 14:11:15',
    '2026-04-20 14:11:15',
    7,
    4
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    14,
    2,
    '2026-04-20 14:11:16',
    '2026-04-20 14:42:17',
    7,
    2
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    16,
    1,
    '2026-04-20 18:01:01',
    '2026-04-20 18:01:01',
    7,
    18
  );
INSERT INTO
  `cartitems` (
    `id`,
    `quantity`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    17,
    1,
    '2026-04-21 05:46:12',
    '2026-04-21 05:46:12',
    7,
    12
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: chatmessages
# ------------------------------------------------------------

INSERT INTO
  `chatmessages` (
    `id`,
    `senderId`,
    `receiverId`,
    `content`,
    `isRead`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    7,
    1,
    'Hello',
    1,
    '2026-04-21 13:08:02',
    '2026-04-21 13:08:33'
  );
INSERT INTO
  `chatmessages` (
    `id`,
    `senderId`,
    `receiverId`,
    `content`,
    `isRead`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    1,
    7,
    'Lô',
    1,
    '2026-04-21 13:08:40',
    '2026-04-21 13:09:45'
  );
INSERT INTO
  `chatmessages` (
    `id`,
    `senderId`,
    `receiverId`,
    `content`,
    `isRead`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    7,
    1,
    'Lô',
    0,
    '2026-04-21 13:22:06',
    '2026-04-21 13:22:06'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: coupons
# ------------------------------------------------------------

INSERT INTO
  `coupons` (
    `id`,
    `code`,
    `discountPercent`,
    `isUsed`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `userId`
  )
VALUES
  (
    1,
    'REVIEW6527',
    10,
    0,
    'Mã giảm giá 10% từ Đánh giá sản phẩm',
    '2026-04-17 06:47:46',
    '2026-04-17 06:47:46',
    4
  );
INSERT INTO
  `coupons` (
    `id`,
    `code`,
    `discountPercent`,
    `isUsed`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `userId`
  )
VALUES
  (
    2,
    'REVIEW3515',
    10,
    0,
    'Mã giảm giá 10% từ Đánh giá sản phẩm',
    '2026-04-20 18:02:43',
    '2026-04-20 18:02:43',
    7
  );

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
    '1776408466533',
    'Đánh giá thành công!',
    'Bạn đã được thưởng 100 điểm và 1 mã giảm giá 10% (Mã: REVIEW6527).',
    0,
    '2026-04-17 06:47:46',
    '2026-04-17 06:47:46',
    'khanhdeptrai'
  );
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
    '1776689285608',
    'Đặt hàng thành công!',
    'Đơn hàng mới với tổng tiền 79,990,000đ đã được đặt thành công.',
    0,
    '2026-04-20 12:48:05',
    '2026-04-20 12:48:05',
    'lightning095'
  );
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
    '1776689578554',
    'Đặt hàng thành công!',
    'Đơn hàng mới với tổng tiền 163,990,000đ đã được đặt thành công.',
    0,
    '2026-04-20 12:52:58',
    '2026-04-20 12:52:58',
    'lightning095'
  );
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
    '1776689870825',
    'Đặt hàng thành công!',
    'Đơn hàng mới với tổng tiền 27,990,000đ đã được đặt thành công.',
    0,
    '2026-04-20 12:57:50',
    '2026-04-20 12:57:50',
    'lightning095'
  );
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
    '1776708139989',
    'Đơn hàng đã giao thành công!',
    'Đơn hàng #870818 đã được giao thành công. Cảm ơn bạn đã mua hàng!',
    0,
    '2026-04-20 18:02:19',
    '2026-04-20 18:02:19',
    'lightning095'
  );
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
    '1776708163521',
    'Đánh giá thành công!',
    'Bạn đã được thưởng 100 điểm và 1 mã giảm giá 10% (Mã: REVIEW3515).',
    0,
    '2026-04-20 18:02:43',
    '2026-04-20 18:02:43',
    'lightning095'
  );
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
    '1776777496680',
    'Đặt hàng thành công!',
    'Đơn hàng mới với tổng tiền 6,490,000đ đã được đặt thành công.',
    0,
    '2026-04-21 13:18:16',
    '2026-04-21 13:18:16',
    'lightning095'
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
    2,
    'iPhone 15 Pro Max',
    NULL,
    34990000,
    1,
    34990000,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    'ORD_SAMPLE_A_1776495166566',
    1
  );
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
    3,
    'MacBook Air M3 13 inch',
    NULL,
    27990000,
    1,
    27990000,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    'ORD_SAMPLE_A_1776495166566',
    3
  );
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
    4,
    'Samsung Galaxy S24 Ultra',
    NULL,
    33990000,
    1,
    33990000,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    'ORD_SAMPLE_B_1776495166581',
    2
  );
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
    5,
    'iPhone 15 Pro Max',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH8boYZTiYz5boNoOG3-NkB8W-0i4BXFBlrw&s',
    34990000,
    1,
    34990000,
    '2026-04-20 12:48:05',
    '2026-04-20 12:48:05',
    '1776689285597',
    1
  );
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
    6,
    'Dell XPS 13 Plus',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s',
    45000000,
    1,
    45000000,
    '2026-04-20 12:48:05',
    '2026-04-20 12:48:05',
    '1776689285597',
    4
  );
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
    7,
    'Dell XPS 13 Plus',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLv6uDfZMWx45jcjYktm5FyZ1bLHpM2Y8L_Q&s',
    45000000,
    3,
    135000000,
    '2026-04-20 12:52:58',
    '2026-04-20 12:52:58',
    '1776689578546',
    4
  );
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
    8,
    'iPad Pro M4 11 inch',
    'https://cdn.tgdd.vn/Products/Images/522/325513/ipad-pro-11-inch-m4-wifi-sliver-1-750x500.jpg',
    28990000,
    1,
    28990000,
    '2026-04-20 12:52:58',
    '2026-04-20 12:52:58',
    '1776689578546',
    6
  );
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
    9,
    'MacBook Air M3 13 inch',
    'https://cdn2.fptshop.com.vn/unsafe/macbook_air_13_m2_midnight_1_35053fbcf9.png',
    27990000,
    1,
    27990000,
    '2026-04-20 12:57:50',
    '2026-04-20 12:57:50',
    '1776689870818',
    3
  );
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
    10,
    'Sony WH-1000XM5',
    'https://hanoicomputercdn.com/media/product/87425_tai_nghe_khong_day_sony_wh1000xm5_sme_mau_bac_1.jpg',
    6490000,
    1,
    6490000,
    '2026-04-21 13:18:16',
    '2026-04-21 13:18:16',
    '1776777496671',
    5
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
    'CONFIRMED',
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
    '2026-04-17 05:26:17',
    NULL,
    '2026-04-17 04:46:35',
    '2026-04-17 05:26:17',
    4
  );
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
    '1776689285597',
    'NEW',
    'COD',
    'Jsucujfj',
    '0395990338',
    'Udjduudf',
    79990000,
    0,
    79990000,
    NULL,
    0,
    0,
    NULL,
    NULL,
    '2026-04-20 12:48:05',
    '2026-04-20 12:48:05',
    7
  );
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
    '1776689578546',
    'CONFIRMED',
    'COD',
    'dt8x',
    '8283838',
    'Gfyhg',
    163990000,
    0,
    163990000,
    NULL,
    0,
    0,
    '2026-04-20 17:41:32',
    NULL,
    '2026-04-20 12:52:58',
    '2026-04-20 17:41:32',
    7
  );
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
    '1776689870818',
    'DELIVERED',
    'COD',
    '37hdjdjd',
    '3626599565',
    'Jdhdue8e',
    27990000,
    0,
    27990000,
    NULL,
    0,
    0,
    '2026-04-20 17:41:21',
    NULL,
    '2026-04-20 12:57:50',
    '2026-04-20 18:02:19',
    7
  );
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
    '1776777496671',
    'NEW',
    'COD',
    'Jshudu',
    '6565659',
    '',
    6490000,
    0,
    6490000,
    NULL,
    0,
    0,
    NULL,
    NULL,
    '2026-04-21 13:18:16',
    '2026-04-21 13:18:16',
    7
  );
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
    'ORD_SAMPLE_A_1776495166566',
    'DELIVERED',
    'COD',
    '123 Đường Số 1, HCM',
    '0901234567',
    NULL,
    62980000,
    0,
    62980000,
    NULL,
    0,
    0,
    NULL,
    NULL,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    5
  );
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
    'ORD_SAMPLE_B_1776495166581',
    'DELIVERED',
    'COD',
    '456 Đường Số 2, Hà Nội',
    '0987654321',
    NULL,
    33990000,
    0,
    33990000,
    NULL,
    0,
    0,
    NULL,
    NULL,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    6
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
    `updatedAt`,
    `brand`
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
    'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-pro-max_3.png',
    14,
    '2026-04-16 11:59:25',
    '2026-04-21 12:01:44',
    'Apple'
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
    `updatedAt`,
    `brand`
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
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra_8__1.png',
    19,
    '2026-04-16 11:59:25',
    '2026-04-21 11:19:30',
    'Samsung'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    3,
    'MacBook Air M3 13 inch',
    27990000,
    'Laptop',
    3501,
    3,
    'Mỏng nhẹ, Chip M3, Pin 18 tiếng. Màn hình Retina 13.6 inch, 8GB RAM, 256GB SSD. Thiết kế siêu mỏng chỉ 1.24cm.',
    'https://cdn2.fptshop.com.vn/unsafe/macbook_air_13_m2_midnight_1_35053fbcf9.png',
    11,
    '2026-04-16 11:59:25',
    '2026-04-21 11:51:01',
    'Apple'
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
    `updatedAt`,
    `brand`
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
    'https://laptops.vn/wp-content/uploads/2024/06/Dell-XPS-13-9320.jpg',
    16,
    '2026-04-16 11:59:25',
    '2026-04-21 13:07:08',
    'Dell'
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
    `updatedAt`,
    `brand`
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
    'https://hanoicomputercdn.com/media/product/87425_tai_nghe_khong_day_sony_wh1000xm5_sme_mau_bac_1.jpg',
    6,
    '2026-04-16 11:59:25',
    '2026-04-21 13:18:10',
    'Sony'
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
    `updatedAt`,
    `brand`
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
    12,
    '2026-04-16 11:59:25',
    '2026-04-21 13:06:41',
    'Apple'
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
    `updatedAt`,
    `brand`
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
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_3_1.png',
    3,
    '2026-04-16 11:59:25',
    '2026-04-21 13:03:14',
    'Other'
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
    `updatedAt`,
    `brand`
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
    4,
    '2026-04-16 11:59:25',
    '2026-04-21 09:03:06',
    'Other'
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
    `updatedAt`,
    `brand`
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
    'https://cdn.tgdd.vn/Products/Images/42/307188/google-pixel-8-pro-600x600.jpg',
    1,
    '2026-04-16 11:59:25',
    '2026-04-21 11:19:30',
    'Google'
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
    `updatedAt`,
    `brand`
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
    'https://cdn2.fptshop.com.vn/unsafe/512x0/filters:format(webp):quality(75)/2024_5_4_638504121200694059_GU603VU-N4019W-4.jpg',
    10,
    '2026-04-16 11:59:25',
    '2026-04-21 13:07:05',
    'ASUS'
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
    `updatedAt`,
    `brand`
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
    1,
    '2026-04-16 11:59:25',
    '2026-04-21 08:15:37',
    'Other'
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
    `updatedAt`,
    `brand`
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
    4,
    '2026-04-16 11:59:25',
    '2026-04-21 12:53:01',
    'HP'
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
    `updatedAt`,
    `brand`
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
    'https://cdn.tgdd.vn/Products/Images/522/311076/samsung-galaxy-tab-s9-ultra-xam-thumb-600x600.jpg',
    0,
    '2026-04-16 11:59:25',
    '2026-04-21 11:56:59',
    'Samsung'
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
    `updatedAt`,
    `brand`
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
    'https://ttcenter.com.vn/uploads/product/x7hj2a6c-1337-surface-pro-9-core-i5-1235u-ram-16gb-ssd-256gb-13-wifi.webp',
    0,
    '2026-04-16 11:59:25',
    '2026-04-21 11:56:59',
    'Other'
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
    `updatedAt`,
    `brand`
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
    '2026-04-21 04:03:16',
    'Apple'
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
    `updatedAt`,
    `brand`
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
    'https://cdn2.cellphones.com.vn/x/media/catalog/product/a/i/airpods_pro_2_sep24_pdp_image_position_2__vn-vi.jpg',
    6,
    '2026-04-16 11:59:25',
    '2026-04-21 13:19:05',
    'Apple'
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
    `updatedAt`,
    `brand`
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
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3U9NFQS7RVN6KbBKETrSaxxJ5PYi3R3KElg&s',
    3,
    '2026-04-16 11:59:25',
    '2026-04-21 11:56:59',
    'Apple'
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
    `updatedAt`,
    `brand`
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
    5,
    '2026-04-16 11:59:25',
    '2026-04-21 09:16:50',
    'Samsung'
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
    `updatedAt`,
    `brand`
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
    'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_4_23_638494792304525973_Chu%E1%BB%99t%20Bluetooth%20Logitech%20MX%20Master%203S%20%C4%90en-dd.jpg',
    2,
    '2026-04-16 11:59:25',
    '2026-04-21 11:19:30',
    'Logitech'
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
    `updatedAt`,
    `brand`
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
    4,
    '2026-04-16 11:59:25',
    '2026-04-21 13:07:02',
    'Apple'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    21,
    'Xiaomi 14',
    18990000,
    'Phone',
    500,
    5,
    'Leica Optics, SD 8 Gen 3',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_14t_2_.png',
    3,
    '2026-04-21 05:18:17',
    '2026-04-21 13:06:52',
    'Xiaomi'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    22,
    'OPPO Find X7 Ultra',
    21990000,
    'Phone',
    300,
    0,
    'Dual Periscope Zoom',
    'https://cdn.viettablet.com/images/detailed/59/oppo-find-x7-ultra-1.jpg',
    1,
    '2026-04-21 05:18:17',
    '2026-04-21 11:19:30',
    'OPPO'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    23,
    'TECNO Camon 30',
    5000000,
    'Phone',
    100,
    0,
    NULL,
    'https://cdn.mobilecity.vn/mobilecity-vn/images/2024/10/tecno-camon-30s-tim.jpg.webp',
    2,
    '2026-04-21 05:23:10',
    '2026-04-21 11:56:59',
    'Other'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    24,
    'HONOR X8b',
    5000000,
    'Phone',
    100,
    0,
    NULL,
    'https://cdn.tgdd.vn/Products/Images/42/324893/honor-x8b-green-thumb-1-600x600.jpg',
    4,
    '2026-04-21 05:23:10',
    '2026-04-21 13:06:55',
    'Other'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    25,
    'Nubia RedMagic 9 Pro',
    5000000,
    'Phone',
    100,
    0,
    NULL,
    'https://cdn.tgdd.vn/Products/Images/42/314207/product-314207-300823-013800-600x600.jpg',
    1,
    '2026-04-21 05:23:10',
    '2026-04-21 11:56:59',
    'Other'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    26,
    'Nokia G42',
    5000000,
    'Phone',
    100,
    0,
    NULL,
    'https://cdn.tgdd.vn/Products/Images/42/309833/nokia-g42-5g-600x600.jpg',
    0,
    '2026-04-21 05:23:10',
    '2026-04-21 11:56:59',
    'Other'
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
    `updatedAt`,
    `brand`
  )
VALUES
  (
    27,
    'Infinix Note 40 Pro',
    5000000,
    'Phone',
    100,
    0,
    NULL,
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_1__1.png',
    1,
    '2026-04-21 05:23:10',
    '2026-04-21 12:44:01',
    'Other'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reviews
# ------------------------------------------------------------

INSERT INTO
  `reviews` (
    `id`,
    `username`,
    `name`,
    `avatar`,
    `rating`,
    `comment`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    1,
    'khanhdeptrai',
    'khanhdeptrai',
    'https://i.pravatar.cc/150?img=12',
    5,
    'hshh8d8hf',
    '2026-04-17 06:47:46',
    '2026-04-17 06:47:46',
    4,
    1
  );
INSERT INTO
  `reviews` (
    `id`,
    `username`,
    `name`,
    `avatar`,
    `rating`,
    `comment`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    2,
    'nguyen_van_a',
    'Nguyễn Văn A',
    'https://i.pravatar.cc/150?img=11',
    5,
    'Điện thoại quá đỉnh, màn hình mượt. Mua của shop rất an tâm!',
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    5,
    1
  );
INSERT INTO
  `reviews` (
    `id`,
    `username`,
    `name`,
    `avatar`,
    `rating`,
    `comment`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    3,
    'nguyen_van_a',
    'Nguyễn Văn A',
    'https://i.pravatar.cc/150?img=11',
    4,
    'Máy mỏng nhẹ, pin trâu. Tuy nhiên màu Midnight bám vân tay hơi nhiều.',
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    5,
    3
  );
INSERT INTO
  `reviews` (
    `id`,
    `username`,
    `name`,
    `avatar`,
    `rating`,
    `comment`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    4,
    'tran_thi_b',
    'Trần Thị B',
    'https://i.pravatar.cc/150?img=5',
    5,
    'Tính năng AI của S24 Ultra cực kỳ tiện lợi. Spen ghi chú rất đã.',
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    6,
    2
  );
INSERT INTO
  `reviews` (
    `id`,
    `username`,
    `name`,
    `avatar`,
    `rating`,
    `comment`,
    `createdAt`,
    `updatedAt`,
    `userId`,
    `productId`
  )
VALUES
  (
    5,
    'lightning095',
    'lightning095',
    'https://i.pravatar.cc/150?img=12',
    5,
    'Tốt',
    '2026-04-20 18:02:43',
    '2026-04-20 18:02:43',
    7,
    3
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: userfavorites
# ------------------------------------------------------------

INSERT INTO
  `userfavorites` (`createdAt`, `updatedAt`, `UserId`, `ProductId`)
VALUES
  ('2026-04-21 04:35:49', '2026-04-21 04:35:49', 7, 8);

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
    `role`,
    `bio`,
    `gender`,
    `birthday`
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
    'admin',
    NULL,
    NULL,
    NULL
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
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
    'customer',
    NULL,
    NULL,
    NULL
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
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
    'customer',
    NULL,
    NULL,
    NULL
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
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
    100,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-16 15:44:09',
    '2026-04-17 06:47:46',
    'customer',
    NULL,
    NULL,
    NULL
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
  )
VALUES
  (
    5,
    'nguyen_van_a',
    '123',
    'nva@test.com',
    'Nguyễn Văn A',
    '0901234567',
    'https://i.pravatar.cc/150?img=11',
    1,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    'customer',
    NULL,
    NULL,
    NULL
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
  )
VALUES
  (
    6,
    'tran_thi_b',
    '123',
    'ttb@test.com',
    'Trần Thị B',
    '0987654321',
    'https://i.pravatar.cc/150?img=5',
    1,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-18 06:52:46',
    '2026-04-18 06:52:46',
    'customer',
    NULL,
    NULL,
    NULL
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
  )
VALUES
  (
    7,
    'lightning095',
    'k11145095',
    'lightning09512@gmail.com',
    'Khánh',
    '0395990338',
    'data:image/jpeg;base64,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',
    1,
    NULL,
    NULL,
    100,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-20 12:33:33',
    '2026-04-21 12:49:34',
    'customer',
    'Đẹp trai',
    '',
    ''
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
    `role`,
    `bio`,
    `gender`,
    `birthday`
  )
VALUES
  (
    10,
    'lmht095',
    'k11145095',
    'lmht095@gmail.com',
    NULL,
    NULL,
    'https://i.pravatar.cc/150?img=12',
    0,
    '179286',
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-04-21 13:35:35',
    '2026-04-21 13:35:35',
    'customer',
    NULL,
    NULL,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: userviewedhistories
# ------------------------------------------------------------

INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    7,
    '2026-04-21 09:16:50',
    '2026-04-21 09:16:50',
    7,
    18
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    9,
    '2026-04-21 10:55:22',
    '2026-04-21 10:55:22',
    7,
    2
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    14,
    '2026-04-21 11:50:53',
    '2026-04-21 11:50:53',
    7,
    25
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    16,
    '2026-04-21 11:50:55',
    '2026-04-21 11:50:55',
    7,
    23
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    17,
    '2026-04-21 11:51:01',
    '2026-04-21 11:51:01',
    7,
    3
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    21,
    '2026-04-21 12:01:44',
    '2026-04-21 12:01:44',
    7,
    1
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    22,
    '2026-04-21 12:44:01',
    '2026-04-21 12:44:01',
    7,
    27
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    23,
    '2026-04-21 12:53:01',
    '2026-04-21 12:53:01',
    7,
    12
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    25,
    '2026-04-21 13:03:14',
    '2026-04-21 13:03:14',
    7,
    7
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    27,
    '2026-04-21 13:06:41',
    '2026-04-21 13:06:41',
    7,
    6
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    29,
    '2026-04-21 13:06:52',
    '2026-04-21 13:06:52',
    7,
    21
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    30,
    '2026-04-21 13:06:55',
    '2026-04-21 13:06:55',
    7,
    24
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    31,
    '2026-04-21 13:07:02',
    '2026-04-21 13:07:02',
    7,
    20
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    32,
    '2026-04-21 13:07:05',
    '2026-04-21 13:07:05',
    7,
    10
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    33,
    '2026-04-21 13:07:08',
    '2026-04-21 13:07:08',
    7,
    4
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    34,
    '2026-04-21 13:18:10',
    '2026-04-21 13:18:10',
    7,
    5
  );
INSERT INTO
  `userviewedhistories` (
    `id`,
    `createdAt`,
    `updatedAt`,
    `UserId`,
    `ProductId`
  )
VALUES
  (
    35,
    '2026-04-21 13:19:05',
    '2026-04-21 13:19:05',
    7,
    16
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
