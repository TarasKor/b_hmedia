import { Hono } from "hono";
import path from "path";
import { getAllParents } from "../../controllers/folders/folder.controllers";
import {
  createMusicFile,
  getAllFiles,
  getFileByid,
  uploadMusicFileToMinio,
} from "../../controllers/musicFiles/musicFiles.controllers";
import { createId } from "@paralleldrive/cuid2";

const folders = new Hono();

folders
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
  .post("/", async (c) => {
    const {
      file,
      name,
      folder_id,
      format,
    }: { file: File; name: string; folder_id: string; format: string } =
      await c.req.parseBody();
    const filePath = path.resolve(import.meta.dir, "../../tempFolder", name);
    await Bun.write(filePath, file);
    const int_name = createId();
    const url = await uploadMusicFileToMinio(
      "music",
      `${int_name}.${format}`,
      filePath
    );
    if (!url) {
      return c.json({ message: "ERROR UPLOADING FILE" }, 500);
    }
    const musicFile = await createMusicFile(
      name,
      folder_id,
      `${int_name}.${format}`
    );
    if (!musicFile) {
      return c.json({ message: "ERROR CREATING FILE" }, 500);
    }
    return c.json({ file: musicFile });
  })
  .delete("/:id", async (c) => {});

export default folders;
