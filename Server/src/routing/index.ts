import express from "express";
import * as projects from "./projectRouting";

const router = express.Router();

// same as here: https://egghead.io/lessons/express-add-and-organize-new-routes-in-an-express-app?pl=building-an-express-api-with-express-5-and-node-14-7b96

router.get("/project", projects.list);
// CRUD
router.post("/prjects", projects.create);
router.get("/project/:id", projects.read);
router.post("/project/:id", projects.update);
router.delete("/project/:id", projects.deleteProject);

export default router;
