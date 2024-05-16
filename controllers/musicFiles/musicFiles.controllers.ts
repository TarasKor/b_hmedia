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
    const res = await minioClient.getObject(bucketName, name);
    console.log(res);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
