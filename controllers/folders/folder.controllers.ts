import { prisma } from "../../db/prismaClient";

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
