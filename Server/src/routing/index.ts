import express from "express";
import projectRouting from "./projectRouting";

const router = express.Router();

router.get("/version", (req: any, res: any) => {
  res.send("/api/version works");
});

router.use("/projects", projectRouting);

export default router;
