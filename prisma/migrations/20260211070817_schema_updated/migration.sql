/*
  Warnings:

  - You are about to drop the `AuthenticationUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuthenticationUser";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT,
    "requestAccepted" BOOLEAN DEFAULT false,
    "noBtnClicked" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
