/*
  Warnings:

  - You are about to drop the `_MachinesToMicroTaskDates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MachinesToMicroTaskDates" DROP CONSTRAINT "_MachinesToMicroTaskDates_A_fkey";

-- DropForeignKey
ALTER TABLE "_MachinesToMicroTaskDates" DROP CONSTRAINT "_MachinesToMicroTaskDates_B_fkey";

-- AlterTable
ALTER TABLE "MicroTaskDates" ADD COLUMN     "used_machine_id" TEXT;

-- DropTable
DROP TABLE "_MachinesToMicroTaskDates";

-- AddForeignKey
ALTER TABLE "MicroTaskDates" ADD CONSTRAINT "MicroTaskDates_used_machine_id_fkey" FOREIGN KEY ("used_machine_id") REFERENCES "Machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
