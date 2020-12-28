require("dotenv").config();
import express from "express";
const morgan = require("morgan");
import http from "http";
const cors = require("cors");
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

const appOrigin = process.env.APP_ORIGIN;
const authAudience = process.env.AUTH0_AUDIENCE;
const authIssuer = process.env.AUTH0_ISSUER;

if (!appOrigin || !authAudience || !authIssuer) {
  throw new Error("make sure that .env is filled");
}

console.log({
  appOrigin,
  authAudience,
  authIssuer,
});

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${authIssuer}.well-known/jwks.json`,
  }),
  audience: authAudience,
  issuer: authIssuer,
  algorithms: ["RS256"],
});

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(morgan("common"));

app.use(cors({ origin: appOrigin, optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("cad.fun server");
});

app.get("/api/public", (req, res) => {
  res.send("cad.fun public api");
});

// =========== auth API ================
app.use(jwtCheck);

app.use(routing);

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
