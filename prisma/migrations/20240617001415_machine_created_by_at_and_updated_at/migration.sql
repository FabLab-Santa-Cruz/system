/*
  Warnings:

  - Added the required column `created_by_id` to the `Machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Machines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Machines" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Machines" ADD CONSTRAINT "Machines_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
