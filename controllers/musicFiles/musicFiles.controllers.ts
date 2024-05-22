import { minioClient } from "../..";
import { prisma } from "../../db/prismaClient";

export const getAllFiles = async () => {
  try {
    const files = await prisma.music_File.findMany();
    return files;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFileByid = async (id: string) => {
  try {
    const file = await prisma.music_File.findUnique({
      where: {
        id: id,
      },
    });
    return file;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const uploadMusicFileToMinio = async (
  bucketName: string,
  name: string,
  file: string
) => {
  try {
    await minioClient.fPutObject(bucketName, name, file);
    await minioClient.presignedGetObject(bucketName, name, 60 * 60 * 24 * 7);
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createMusicFile = async (
  name: string,
  folder_id: string,
  int_name: string
) => {
  try {
    const file = await prisma.music_File.create({
      data: {
        name,
        folder_id,
        int_name,
        duration: 450,
        format: "mp3",
      },
    });
    await prisma.music_File.update({
      where: {
        id: file.id,
      },
      data: {
        parent_folder: {
          connect: {
            id: folder_id,
          },
        },
      },
    });
    return file;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteMusicFileFromMinio = async (
  bucketName: string,
  name: string
) => {
  try {
    await minioClient.removeObject(bucketName, name);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteMusicFile = async (id: string) => {
  try {
    const file = await prisma.music_File.findUnique({
      where: {
        id,
      },
    });
    if (!file) {
      return false;
    }
    await prisma.music_File.delete({
      where: {
        id,
      },
    });
    const isDeletedFromMinIO = await deleteMusicFileFromMinio(
      "music",
      file.int_name
    );
    if (!isDeletedFromMinIO) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
