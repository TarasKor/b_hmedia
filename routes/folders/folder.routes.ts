import { Hono } from "hono";
import { getFolderByid } from "../../controllers/folders/folder.controllers";

const folders = new Hono();

folders
  .get("/", (c) => {
    return c.json({ message: "GET ALL FOLDERS" });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const folder = await getFolderByid(id);
    console.log(folder);
    return c.json({ message: `GET FOLDER ${id}` });
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    console.log(body);
    return c.json({ message: "POST FOLDER" });
  });

export default folders;
