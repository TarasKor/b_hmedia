import { Hono } from "hono";
import {
  createFolder,
  getAllFolders,
  getAllParents,
  getFolderByid,
  getFolderChildren,
} from "../../controllers/folders/folder.controllers";

const folders = new Hono();

folders
  .get("/", async (c) => {
    const folders = await getAllFolders();
    if (!folders) {
      return c.json({ message: "ERROR GETTING FOLDERS" }, 500);
    }
    return c.json({ folders });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const folder = await getFolderByid(id);
    if (!folder) {
      return c.json({ message: "FOLDER NOT FOUND" }, 404);
    }
    const parents = await getAllParents(folder.id);
    if (!parents) {
      return c.json({ message: "ERROR GETTING PARENTS" }, 500);
    }
    const folderChildren = await getFolderChildren(folder.id);
    if (!folderChildren) {
      return c.json({ message: "ERROR GETTING CHILDREN" }, 500);
    }
    return c.json({
      folder: id,
      parents,
      children: {
        folders: folderChildren.children_folders,
        files: folderChildren.children_files,
      },
    });
  })
  .post("/", async (c) => {
    const body = (await c.req.json()) as {
      name: string;
      parent_folder_id: string;
    };
    const createdFolder = await createFolder(body.name, body.parent_folder_id);
    if (!createdFolder) {
      return c.json({ message: "ERROR CREATING FOLDER" }, 500);
    }
    return c.json({ folder: createdFolder });
  });

export default folders;
