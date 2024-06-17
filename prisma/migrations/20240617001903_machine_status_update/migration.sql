/*
  Warnings:

  - The values [IN_USE,NOT_IN_USE,IN_MAINTENANCE] on the enum `MachineStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MachineStatus_new" AS ENUM ('USABLE', 'IN_REPAIR');
ALTER TABLE "Machines" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Machines" ALTER COLUMN "status" TYPE "MachineStatus_new" USING ("status"::text::"MachineStatus_new");
ALTER TABLE "MachineMaintenance" ALTER COLUMN "status" TYPE "MachineStatus_new" USING ("status"::text::"MachineStatus_new");
ALTER TYPE "MachineStatus" RENAME TO "MachineStatus_old";
ALTER TYPE "MachineStatus_new" RENAME TO "MachineStatus";
DROP TYPE "MachineStatus_old";
ALTER TABLE "Machines" ALTER COLUMN "status" SET DEFAULT 'USABLE';
COMMIT;

-- AlterTable
ALTER TABLE "Machines" ALTER COLUMN "status" SET DEFAULT 'USABLE';
