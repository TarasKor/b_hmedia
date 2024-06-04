import { Hono } from "hono";
import path from "path";
import { getAllParents } from "../../controllers/videoFolders/videoFiolder.controllers";
import { createId } from "@paralleldrive/cuid2";
import { stream } from "hono/streaming";
import { minioClient } from "../..";
import {
  createVideoFile,
  deleteVideoFile,
  uploadVideoFileToMinio,
  getAllFiles,
  getAsyncBufferFromMinio,
  getFileByid,
} from "../../controllers/videoFiles/videoFiles.contorollers";
import { clearFolder, mergeChunks } from "../../utils";

const videoFiles = new Hono();

videoFiles
  .get("/", async (c) => {
    const files = await getAllFiles();
    if (!files) {
      return c.json({ message: "ERROR GETTING FILES" }, 500);
    }
    return c.json({ files });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const file = await getFileByid(id);
    if (!file) {
      return c.json({ message: "FILE NOT FOUND" }, 404);
    }
    const parent = await getAllParents(file.folder_id);
    if (!parent) {
      return c.json({ message: "ERROR GETTING PARENTS" }, 500);
    }
    return c.json({
      file,
      parent,
    });
  })
  .post("/upload", async (c) => {
    const {
      chunk,
      chunksAmount,
      chunkNumber,
      fileName,
    }: {
      chunk: File;
      chunksAmount: string;
      chunkNumber: string;
      fileName: string;
    } = await c.req.parseBody();
    const filePath = path.resolve(
      import.meta.dir,
      "../../tempFolder",
      `${fileName}.part_${chunkNumber}`
    );
    await Bun.write(filePath, chunk);
    return c.json({
      message: "CHUNK RECEIVED",
      progress: Number(chunkNumber) / Number(chunksAmount),
    });
  })
  .post("/sync", async (c) => {
    const { fileName, format, folder_id } = await c.req.json();
    try {
      await mergeChunks(fileName);
    } catch (error) {
      console.error(error);
      return c.json({ message: "ERROR MERGING FILES" }, 500);
    }
    const int_name = createId();
    const filePath = path.resolve(
      import.meta.dir,
      "../../tempFolder",
      fileName
    );
    const url = await uploadVideoFileToMinio(
      "videos",
      `${int_name}.${format}`,
      filePath
    );
    if (!url) {
      return c.json({ message: "ERROR UPLOADING FILE" }, 500);
    }
    const videoFile = await createVideoFile(
      fileName,
      folder_id,
      `${int_name}.${format}`
    );
    if (!videoFile) {
      return c.json({ message: "ERROR CREATING FILE" }, 500);
    }
    await clearFolder(path.resolve(import.meta.dir, "../../tempFolder"));
    return c.json({ file: videoFile });
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const result = await deleteVideoFile(id);
    if (!result) {
      return c.json({ message: "ERROR DELETING FILE" }, 500);
    }
    return c.json({ message: "FILE DELETED" });
  })
  .get("/:id/stream", async (c) => {
    const { id } = c.req.param();
    const file = await getFileByid(id);
    if (!file) {
      return c.json({ message: "FILE NOT FOUND" }, 404);
    }
    const d = await getAsyncBufferFromMinio("videos", file.int_name);
    return stream(c, async (stream) => {
      // Write a process to be executed when aborted.
      stream.onAbort(() => {
        console.log("Aborted!");
      });
      await stream.write(d);
    });
  });

export default videoFiles;
