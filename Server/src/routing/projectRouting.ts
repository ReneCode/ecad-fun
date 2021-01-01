import express from "express";

import { Request, Response } from "express";

const jwt = require("jsonwebtoken");

import HttpStatus = require("http-status-codes");
import { projectService } from "../ProjectService";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  // getUserId(req);
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

export const getUserId = (req: Request): string | null => {
  const { authorization } = req.headers;
  console.log(JSON.stringify(req, null, 2));

  if (!authorization) {
    return null;
  }
  const token = authorization?.split(" ");
  if (token && token.length === 2 && token[0] === "Bearer") {
    console.log(">>>>");
    const accessToken = token[1];
    const SECRET =
      "GptmwwhQF951evb6pLh0ax8VO8geKKORbcbQ1BqJpSwZ-c_siTB5ml_MGaZvmgFL";
    const payload = jwt.verify(accessToken, SECRET, {});
    console.log(">>>>", payload);
  }
  return null;
};

export default router;
