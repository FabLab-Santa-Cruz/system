/*
  Warnings:

  - You are about to drop the column `status` on the `MachineMaintenance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MachineMaintenance" DROP COLUMN "status",
ALTER COLUMN "description" DROP NOT NULL;
