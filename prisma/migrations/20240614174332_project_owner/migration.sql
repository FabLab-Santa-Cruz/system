/*
  Warnings:

  - You are about to drop the `_ProjectsToVolunteers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectsToVolunteers" DROP CONSTRAINT "_ProjectsToVolunteers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectsToVolunteers" DROP CONSTRAINT "_ProjectsToVolunteers_B_fkey";

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "creator_id" TEXT;

-- DropTable
DROP TABLE "_ProjectsToVolunteers";

-- CreateTable
CREATE TABLE "_ProjectWorker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectWorker_AB_unique" ON "_ProjectWorker"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectWorker_B_index" ON "_ProjectWorker"("B");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Volunteers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ProjectWorker" ADD CONSTRAINT "_ProjectWorker_A_fkey" FOREIGN KEY ("A") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectWorker" ADD CONSTRAINT "_ProjectWorker_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
