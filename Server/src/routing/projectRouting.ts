import express from "express";

import { Request, Response } from "express";
import HttpStatus = require("http-status-codes");
import { projectService } from "../ProjectService";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json([{ name: "projectRouting" }]);
});

router.get("/:id", async (req: Request, res: Response) => {
  const projectId = req.params.id;

  const project = await projectService.open(projectId);
  res.json(project.getRoot());
});

router.post("/", async (req: Request, res: Response) => {
  const name = req.body?.name;
  if (name) {
    const project = projectService.open(name);
    res.json(project);
  } else {
    res.status(HttpStatus.BAD_REQUEST);
  }
});

router.put("/:id", (req: Request, res: Response) => {
  res.send("update ok");
});

router.delete("/:id", (req: Request, res: Response) => {
  res.send("delete ok");
});

export default router;
