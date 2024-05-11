-- CreateTable
CREATE TABLE "Carers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Carers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CarersToVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CarersToVolunteers_AB_unique" ON "_CarersToVolunteers"("A", "B");

-- CreateIndex
CREATE INDEX "_CarersToVolunteers_B_index" ON "_CarersToVolunteers"("B");

-- AddForeignKey
ALTER TABLE "_CarersToVolunteers" ADD CONSTRAINT "_CarersToVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "Carers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarersToVolunteers" ADD CONSTRAINT "_CarersToVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
