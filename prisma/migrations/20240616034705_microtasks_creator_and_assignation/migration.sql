/*
  Warnings:

  - You are about to drop the `_MicroTasksToVolunteers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by_id` to the `MicroTasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MicroTasksToVolunteers" DROP CONSTRAINT "_MicroTasksToVolunteers_A_fkey";

-- DropForeignKey
ALTER TABLE "_MicroTasksToVolunteers" DROP CONSTRAINT "_MicroTasksToVolunteers_B_fkey";

-- AlterTable
ALTER TABLE "MicroTasks" ADD COLUMN     "created_by_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MicroTasksToVolunteers";

-- CreateTable
CREATE TABLE "_MicroTaskWorker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MicroTaskWorker_AB_unique" ON "_MicroTaskWorker"("A", "B");

-- CreateIndex
CREATE INDEX "_MicroTaskWorker_B_index" ON "_MicroTaskWorker"("B");

-- AddForeignKey
ALTER TABLE "MicroTasks" ADD CONSTRAINT "MicroTasks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MicroTaskWorker" ADD CONSTRAINT "_MicroTaskWorker_A_fkey" FOREIGN KEY ("A") REFERENCES "MicroTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MicroTaskWorker" ADD CONSTRAINT "_MicroTaskWorker_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
