-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FOLDER', 'FILE');

-- CreateTable
CREATE TABLE "Music_Folder" (
    "id" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'FOLDER',
    "name" TEXT NOT NULL,
    "parent_folder_id" TEXT,

    CONSTRAINT "Music_Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music_File" (
    "id" SERIAL NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'FILE',
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,

    CONSTRAINT "Music_File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Music_Folder" ADD CONSTRAINT "Music_Folder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "Music_Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Music_File" ADD CONSTRAINT "Music_File_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Music_Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
