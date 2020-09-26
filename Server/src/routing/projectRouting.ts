import express = require("express");
import HttpStatus = require("http-status-codes");

const router = express.Router();
import { projectService } from "../ProjectService";

router.get("/:projectId", async (req, res) => {
  const projectId = req.params.projectId;

  const project = projectService.open(projectId);
  res.json(project);
});

/*
body: {
  name: string
} 
*/
router.post("/", async (req, res) => {
  const name = req.body?.name;
  if (name) {
    const project = projectService.open(name);
    res.json(project);
  } else {
    res.status(HttpStatus.BAD_REQUEST);
  }
});

export default router;
