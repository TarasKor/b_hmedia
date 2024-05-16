import { Hono } from "hono";
import path from "path";
import { getAllParents } from "../../controllers/folders/folder.controllers";
import {
  getAllFiles,
  getFileByid,
  uploadMusicFileToMinio,
} from "../../controllers/musicFiles/musicFiles.controllers";

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
    const { file, name }: { name: string; file: File } =
      await c.req.parseBody();
    const filePath = path.resolve(import.meta.dir, "../../tempFolder", name);
    await Bun.write(filePath, file);
    uploadMusicFileToMinio("music", name, filePath);
    // const createdFolder = await createFolder(body.name, body.parent_folder_id);
    // if (!createdFolder) {
    //   return c.json({ message: "ERROR CREATING FOLDER" }, 500);
    // }
    // return c.json({ folder: createdFolder });
    return c.json({ message: "NOT IMPLEMENTED" }, 501);
  });
//   .delete("/:id", async (c) => {
//     const { id } = c.req.param();
//     const folder = await getFolderByid(id);
//     if (!folder) {
//       return c.json({ message: "FOLDER NOT FOUND" }, 404);
//     }
//     const deletedFolder = await deleteFolder(id);
//     if (!deletedFolder) {
//       return c.json({ message: "ERROR DELETING FOLDER" }, 500);
//     }
//     return c.json({ folder: deletedFolder });
//   });

export default folders;
