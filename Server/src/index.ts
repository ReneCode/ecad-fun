require("dotenv").config();
import express from "express";
const morgan = require("morgan");
import http from "http";
const bodyParser = require("body-parser");

import debug from "debug";
import routing from "./routing/index";
import { initSocketIO } from "./io";

const serverDebug = debug("server");

const app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(morgan("common"));

app.use(routing);

app.get("/", (req, res) => {
  res.send("cad.fun server");
});

// not found handler
app.use((req, res) => {
  res.status(404).send("sorry, not found");
});

// error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error(error.stack);
  res.status(500).send(error.message);
});

const port = process.env.PORT || 8080; // default port to listen

serverDebug("starting ...");

const server = http.createServer(app);

initSocketIO(server);

server.listen(port, () => {
  serverDebug(`listening on port: ${port}`);
});
