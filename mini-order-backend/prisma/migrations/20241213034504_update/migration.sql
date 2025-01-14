/*
  Warnings:

  - You are about to drop the column `type` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `category` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MenuItem` DROP COLUMN `type`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NOT NULL DEFAULT '';
