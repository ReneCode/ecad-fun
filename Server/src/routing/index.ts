import express from "express";
import projectRouting from "./projectRouting";

const router = express.Router();

router.use("/projects", projectRouting);

export default router;
