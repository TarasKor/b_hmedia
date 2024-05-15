/*
  Warnings:

  - The primary key for the `Music_File` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Music_File" DROP CONSTRAINT "Music_File_folder_id_fkey";

-- AlterTable
ALTER TABLE "Music_File" DROP CONSTRAINT "Music_File_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Music_File_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Music_File_id_seq";

-- AddForeignKey
ALTER TABLE "Music_File" ADD CONSTRAINT "Music_File_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Music_Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
