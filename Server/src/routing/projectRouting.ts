import express = require("express");
import HttpStatus = require("http-status-codes");
import { projectService } from "../ProjectService";

const router = express.Router();

router.use((req, res, next) => {
  console.log("check project");
  next();
});

router.get("/", (req, res) => {
  res.json({ name: "projectRouting" });
});

router.get("/:projectId", async (req, res) => {
  const projectId = req.params.projectId;

  const project = await projectService.open(projectId);
  res.json(project.getRoot());
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
