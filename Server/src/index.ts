require("dotenv").config();
import express from "express";
const morgan = require("morgan");
import http from "http";
const bodyParser = require("body-parser");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

import debug from "debug";
import routing from "./routing/index";
import { initSocketIO } from "./io";
import { Scheduler } from "./Scheduler";
import { drawDashboard } from "./dashboard/dashboard";

const serverDebug = debug("server");

const app = express();

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

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

app.get("/api/public", (req, res) => {
  res.send("cad.fun public api");
});

app.use(jwtCheck);

app.get("/api/private", (req, res) => {
  res.send("cad.fun private api");
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
  serverDebug(`listening on port:${port}.`);
  if (process.env.NODE_ENV === "development") {
    // new Scheduler(() => {
    //   drawDashboard();
    // }, 5_000);
  }
});
