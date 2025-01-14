/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `mail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `mail` ADD COLUMN `adminId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `mail_adminId_key` ON `mail`(`adminId`);

-- AddForeignKey
ALTER TABLE `mail` ADD CONSTRAINT `mail_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
