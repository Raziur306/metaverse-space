/*
  Warnings:

  - You are about to drop the column `heigh` on the `Space` table. All the data in the column will be lost.
  - Added the required column `static` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "static" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "heigh",
ADD COLUMN     "height" INTEGER;
