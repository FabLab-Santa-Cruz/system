/*
  Warnings:

  - You are about to drop the column `particulate_matter_100` on the `AirQualityWeather` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AirQualityWeather" DROP COLUMN "particulate_matter_100";

-- AlterTable
ALTER TABLE "BiometricPosts" ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
