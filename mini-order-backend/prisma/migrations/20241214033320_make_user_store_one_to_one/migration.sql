/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Store` DROP FOREIGN KEY `Store_ownerId_fkey`;

-- AlterTable
ALTER TABLE `Store` DROP COLUMN `ownerId`,
    ADD COLUMN `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Store_userId_key` ON `Store`(`userId`);

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
