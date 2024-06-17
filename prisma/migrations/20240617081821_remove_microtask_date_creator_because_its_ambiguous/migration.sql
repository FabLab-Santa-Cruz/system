/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `MicroTaskDates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MicroTaskDates" DROP CONSTRAINT "MicroTaskDates_created_by_id_fkey";

-- AlterTable
ALTER TABLE "MicroTaskDates" DROP COLUMN "created_by_id";
