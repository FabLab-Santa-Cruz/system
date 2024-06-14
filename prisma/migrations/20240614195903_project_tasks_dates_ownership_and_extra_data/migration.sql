/*
  Warnings:

  - You are about to drop the `_ProjectTasksToVolunteers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by_id` to the `ProjectTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `ProjectTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProjectTasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProjectTasksToVolunteers" DROP CONSTRAINT "_ProjectTasksToVolunteers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectTasksToVolunteers" DROP CONSTRAINT "_ProjectTasksToVolunteers_B_fkey";

-- AlterTable
ALTER TABLE "ProjectTasks" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_ProjectTasksToVolunteers";

-- CreateTable
CREATE TABLE "_ProjectTaskWorker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectTaskWorker_AB_unique" ON "_ProjectTaskWorker"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectTaskWorker_B_index" ON "_ProjectTaskWorker"("B");

-- AddForeignKey
ALTER TABLE "ProjectTasks" ADD CONSTRAINT "ProjectTasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTasks" ADD CONSTRAINT "ProjectTasks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTaskWorker" ADD CONSTRAINT "_ProjectTaskWorker_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTaskWorker" ADD CONSTRAINT "_ProjectTaskWorker_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
