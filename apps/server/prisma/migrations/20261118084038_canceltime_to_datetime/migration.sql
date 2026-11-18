/*
  Warnings:

  - Changed the type of `cancelTime` on the `TimeSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "cancelTime",
ADD COLUMN     "cancelTime" TIMESTAMP(3) NOT NULL;
