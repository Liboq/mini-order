/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `MenuItem` ADD COLUMN `imageId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MenuItem_imageId_key` ON `MenuItem`(`imageId`);

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Upload`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
