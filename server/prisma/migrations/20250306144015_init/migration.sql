-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `senderType` ENUM('CUSTOMER', 'SUPPLIER') NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `receiverType` ENUM('CUSTOMER', 'SUPPLIER') NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
