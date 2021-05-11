import express from "express";
import projectRouting from "./projectRouting";
import adminRouting from "./adminRouting";

const router = express.Router();

router.get("/version", (req: any, res: any) => {
  res.send("/api/version works");
});

router.use("/projects", projectRouting);
router.use("/admin", adminRouting);

export default router;
