import express from "express";
import { Request, Response } from "express";

import HttpStatus = require("http-status-codes");
import {
  dbAddProject,
  dbGetProjectById,
  dbGetProjects,
  dbUpdateProject,
} from "../Database";
import { getUserIdFromRequest } from "../utils";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const projects = await dbGetProjects(userId);
  res.json(projects);
});

router.get("/:id", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const projectId = req.params.id;

  const project = await dbGetProjectById(userId, projectId);
  if (project) {
    res.json(project);
  } else {
    res.status(HttpStatus.NOT_FOUND).send();
  }
});

router.post("/", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const name: string = req.body?.name;
  if (name) {
    const project = await dbAddProject(userId, name);
    res.json(project);
  } else {
    res.status(HttpStatus.BAD_REQUEST).send();
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const projectId = req.params.id;
  const name: string = req.body?.name;
  if (name) {
    const project = await dbUpdateProject(userId, projectId, { name });
    res.json(project);
  } else {
    res.status(HttpStatus.BAD_REQUEST).send();
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  res.send("delete ok");
});

export default router;
