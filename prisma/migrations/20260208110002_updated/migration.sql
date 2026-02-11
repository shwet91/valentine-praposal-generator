/*
  Warnings:

  - You are about to drop the `praposalAccepted` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "praposalAccepted" DROP CONSTRAINT "praposalAccepted_ownerId_fkey";

-- AlterTable
ALTER TABLE "AuthenticationUser" ADD COLUMN     "noBtnClicked" BOOLEAN DEFAULT false,
ADD COLUMN     "requestAccepted" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "praposalAccepted";
