import { minioClient } from "../..";
import { prisma } from "../../db/prismaClient";

export const getAllFiles = async () => {
  try {
    const files = await prisma.video_File.findMany();
    return files;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFileByid = async (id: string) => {
  try {
    const file = await prisma.video_File.findUnique({
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

export const uploadVideoFileToMinio = async (
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

export const createVideoFile = async (
  name: string,
  folder_id: string,
  int_name: string
) => {
  try {
    const file = await prisma.video_File.create({
      data: {
        name,
        folder_id,
        int_name,
        duration: 450,
        format: "mp4",
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

export const deleteVideoFileFromMinio = async (
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

export const deleteVideoFile = async (id: string) => {
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
    const isDeletedFromMinIO = await deleteVideoFileFromMinio(
      "videos",
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
export const getAsyncBufferFromMinio = async (
  bucketName: string,
  name: string
) => {
  const data = await minioClient.getObject(bucketName, name);
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    data.on("data", (chunk) => {
      chunks.push(chunk);
    });
    data.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    data.on("error", (err) => {
      reject(err);
    });
  });
};
