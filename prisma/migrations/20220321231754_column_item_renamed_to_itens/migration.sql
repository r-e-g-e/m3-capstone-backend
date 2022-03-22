/*
  Warnings:

  - You are about to drop the column `item` on the `cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "item",
ADD COLUMN     "itens" TEXT;
