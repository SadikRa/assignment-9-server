/*
  Warnings:

  - Added the required column `category` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('GADGETS', 'CLOTHING', 'BOOKS');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" "ProductCategory" NOT NULL;
