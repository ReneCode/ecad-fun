import express from "express";
import { Request, Response } from "express";

import HttpStatus = require("http-status-codes");
import { pgCreateDatabaseIfNotExists } from "../postgres/postges";

const DATABASE_NAME = "ecad.fun";

const router = express.Router();

router.get("/database", async (req: Request, res: Response) => {});

router.post("/database", async (req: Request, res: Response) => {
  await pgCreateDatabaseIfNotExists(DATABASE_NAME);
  return HttpStatus.OK;
});

export default router;
