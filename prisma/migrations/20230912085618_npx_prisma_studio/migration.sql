/*
  Warnings:

  - You are about to drop the column `memmberId` on the `DirectMessage` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_memmberId_fkey";

-- DropIndex
DROP INDEX "DirectMessage_memmberId_idx";

-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "memmberId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "DirectMessage_memberId_idx" ON "DirectMessage"("memberId");

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
