import { Express } from "express";

import debug from "debug";

const serverDebug = debug("server");

// import projectService from "./ProjectService";
// import clientService from "./ClientService";

export function setupExpressRouting(app: Express) {
  // app.use("/project", projectRouting);

  app.use("/project", (req, res) => {
    res.send("project routing");
  });
}
