import { Glob } from "bun";
import path from "path";
import fs from "fs";

export const mergeChunks = (fileName: string) => {
  return new Promise(async (resolve, reject) => {
    const glob = new Glob(`**/${fileName}.part_*`);
    let files: string[] = [];
    for await (const file of glob.scan(
      path.resolve(import.meta.dir, "../tempFolder")
    )) {
      files.push(file);
    }
    const sortedFiles = files.sort((a, b) => {
      const aNum = Number(a.split("_")[1]);
      const bNum = Number(b.split("_")[1]);
      return aNum - bNum;
    });

    const filePath = path.resolve(import.meta.dir, "../tempFolder", fileName);
    const writeStream = fs.createWriteStream(filePath);

    for (const file of sortedFiles) {
      const chunkPath = path.resolve(import.meta.dir, "../tempFolder", file);
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
    }
    writeStream.end();
    writeStream.on("finish", () => {
      resolve({ message: "FILE MERGED" });
    });
    writeStream.on("error", (err) => {
      reject(err);
    });
  });
};

export const clearFolder = (folderPath: string) => {
  return new Promise(async (resolve, reject) => {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.resolve(folderPath, file);
      fs.unlinkSync(filePath);
    }
    resolve(true);
  });
};
