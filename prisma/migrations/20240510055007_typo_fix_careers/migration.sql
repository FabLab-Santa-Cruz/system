/*
  Warnings:

  - You are about to drop the `Carers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CarersToVolunteers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CarersToVolunteers" DROP CONSTRAINT "_CarersToVolunteers_A_fkey";

-- DropForeignKey
ALTER TABLE "_CarersToVolunteers" DROP CONSTRAINT "_CarersToVolunteers_B_fkey";

-- DropTable
DROP TABLE "Carers";

-- DropTable
DROP TABLE "_CarersToVolunteers";

-- CreateTable
CREATE TABLE "Careers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CareersToVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CareersToVolunteers_AB_unique" ON "_CareersToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_CareersToVolunteers_B_index" ON "_CareersToVolunteers"("B");

-- AddForeignKey
ALTER TABLE "_CareersToVolunteers" ADD CONSTRAINT "_CareersToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "Careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareersToVolunteers" ADD CONSTRAINT "_CareersToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
