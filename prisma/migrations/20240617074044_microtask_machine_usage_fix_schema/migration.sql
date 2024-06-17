/*
  Warnings:

  - You are about to drop the `MachineUsageMicroTasks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by_id` to the `MicroTaskDates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MachineUsageMicroTasks" DROP CONSTRAINT "MachineUsageMicroTasks_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "MachineUsageMicroTasks" DROP CONSTRAINT "MachineUsageMicroTasks_micro_task_id_fkey";

-- AlterTable
ALTER TABLE "MicroTaskDates" ADD COLUMN     "created_by_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "MachineUsageMicroTasks";

-- CreateTable
CREATE TABLE "_MachinesToMicroTaskDates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MachinesToMicroTaskDates_AB_unique" ON "_MachinesToMicroTaskDates"("A", "B");

-- CreateIndex
CREATE INDEX "_MachinesToMicroTaskDates_B_index" ON "_MachinesToMicroTaskDates"("B");

-- AddForeignKey
ALTER TABLE "MicroTaskDates" ADD CONSTRAINT "MicroTaskDates_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MachinesToMicroTaskDates" ADD CONSTRAINT "_MachinesToMicroTaskDates_A_fkey" FOREIGN KEY ("A") REFERENCES "Machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MachinesToMicroTaskDates" ADD CONSTRAINT "_MachinesToMicroTaskDates_B_fkey" FOREIGN KEY ("B") REFERENCES "MicroTaskDates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
