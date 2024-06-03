-- CreateTable
CREATE TABLE "Video_Folder" (
    "id" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'FOLDER',
    "name" TEXT NOT NULL,
    "parent_folder_id" TEXT,

    CONSTRAINT "Video_Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video_File" (
    "id" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'FILE',
    "name" TEXT NOT NULL,
    "int_name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,

    CONSTRAINT "Video_File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video_Folder" ADD CONSTRAINT "Video_Folder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "Video_Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video_File" ADD CONSTRAINT "Video_File_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Video_Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
