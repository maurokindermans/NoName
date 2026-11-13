-- CreateTable
CREATE TABLE "TimeSlotType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "amountInEuros" TEXT NOT NULL,

    CONSTRAINT "TimeSlotType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlotType_name_key" ON "TimeSlotType"("name");
