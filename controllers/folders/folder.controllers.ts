import { prisma } from "../../db/prismaClient";

export const getAllFolders = async () => {
  try {
    const folders = await prisma.music_Folder.findMany();
    return folders;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFolderByid = async (id: string) => {
  try {
    const folder = await prisma.music_Folder.findUnique({
      where: {
        id: id,
      },
    });
    return folder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllParents = async (id: string) => {
  try {
    const allParentsFromRoot: { name: string; id: string }[] = [];

    // Recursively find all parents of the file
    async function findParents(id: string) {
      const parent = await prisma.music_Folder.findUnique({
        where: {
          id: id,
        },
        include: {
          parent_folder: {
            select: {
              parent_folder_id: true,
              name: true,
            },
          },
        },
      });
      if (parent && parent.parent_folder_id) {
        allParentsFromRoot.push({ name: parent.name, id: parent.id });
        await findParents(parent.parent_folder_id);
      }
    }

    await findParents(id);
    const rootFolder = await prisma.music_Folder.findFirst({
      where: {
        parent_folder_id: null,
      },
    });
    if (rootFolder) {
      allParentsFromRoot.push({ name: rootFolder.name, id: rootFolder.id });
    }
    return allParentsFromRoot.reverse();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFolderChildren = async (id: string) => {
  try {
    const folder = await prisma.music_Folder.findUnique({
      where: {
        id: id,
      },
      include: {
        children_folders: true,
        children_files: true,
      },
    });
    return folder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createFolder = async (name: string, parent_folder_id: string) => {
  try {
    const folder = await prisma.music_Folder.create({
      data: {
        name: name,
      },
    });
    return folder;
  } catch (error) {
    console.error(error);
    return null;
  }
};
