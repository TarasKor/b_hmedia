/*
  Warnings:

  - You are about to drop the column `url` on the `Music_File` table. All the data in the column will be lost.
  - Added the required column `int_name` to the `Music_File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Music_File" DROP COLUMN "url",
ADD COLUMN     "int_name" TEXT NOT NULL;
