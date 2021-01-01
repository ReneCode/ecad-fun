import express from "express";
import projectRouting from "./projectRouting";

const router = express.Router();

router.get("/private", (req: any, res: any) => {
  res.send("/api/private works");
});

router.use("/projects", projectRouting);

export default router;
