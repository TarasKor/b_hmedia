-- DropForeignKey
ALTER TABLE "Music_Folder" DROP CONSTRAINT "Music_Folder_parent_folder_id_fkey";

-- AddForeignKey
ALTER TABLE "Music_Folder" ADD CONSTRAINT "Music_Folder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "Music_Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
