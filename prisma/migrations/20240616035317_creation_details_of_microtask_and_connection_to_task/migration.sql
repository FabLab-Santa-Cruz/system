/*
  Warnings:

  - Added the required column `task_id` to the `MicroTasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MicroTasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MicroTasks" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "task_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "MicroTasks" ADD CONSTRAINT "MicroTasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "ProjectTasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
