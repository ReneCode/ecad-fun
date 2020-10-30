import { Request, Response } from "express";
import HttpStatus = require("http-status-codes");
import { projectService } from "../ProjectService";

export function list(req: Request, res: Response) {
  res.json([{ name: "projectRouting" }]);
}

export async function read(req: Request, res: Response) {
  const projectId = req.params.id;

  const project = await projectService.open(projectId);
  res.json(project.getRoot());
}

/*
body: {
  name: string
} 
*/
export async function create(req: Request, res: Response) {
  const name = req.body?.name;
  if (name) {
    const project = projectService.open(name);
    res.json(project);
  } else {
    res.status(HttpStatus.BAD_REQUEST);
  }
}

export function update(req: Request, res: Response) {
  res.send("ok");
}

export function deleteProject(req: Request, res: Response) {
  res.send("ok");
}
