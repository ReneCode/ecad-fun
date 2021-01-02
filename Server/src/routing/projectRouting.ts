import express from "express";

import { Request, Response } from "express";

const jwt = require("jsonwebtoken");

import HttpStatus = require("http-status-codes");
import { dbAddProject, dbGetProjectById, dbGetProjects } from "../Database";
import { projectService } from "../ProjectService";
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
    res.status(HttpStatus.NOT_FOUND);
  }
});

router.post("/", async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const name = req.body?.name;
  if (name) {
    const project = await dbAddProject(userId, name);
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
