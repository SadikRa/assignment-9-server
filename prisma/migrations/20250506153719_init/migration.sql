/*
  Warnings:

  - You are about to drop the column `categoryId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `downVote` to the `votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upVote` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_categoryId_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "categoryId",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "downVote" INTEGER NOT NULL,
ADD COLUMN     "upVote" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Category";
