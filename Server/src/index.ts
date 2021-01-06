require("dotenv").config();
import express from "express";
const morgan = require("morgan");
import http from "http";
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

import debug from "debug";
import routing from "./routing/index";
import { initSocketIO } from "./io";
import { Scheduler } from "./Scheduler";
import { drawDashboard } from "./dashboard/dashboard";

const serverDebug = debug("server");

const app = express();

let appOrigin = process.env.APP_ORIGIN;
const allowedOrigins = [appOrigin];

// if (process.env.NODE_ENV === "production") {
//   appOrigin = "https://ecad-fun.vercel.app";
// }

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
  secret: jwksRsa.expressJwtSecret({
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
app.use(
  cors({
    origin: function (
      origin: string,
      callback: (data: any, ok: boolean) => void
    ) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site doese not allow access from ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.get("/", (req, res) => {
  res.send("cad.fun server");
});

// =========== authorization for /api routes ================
app.use("/api", jwtCheck, (err: any, req: any, res: any, next: any) => {
  console.log(" app use /api ==================");
  if (err) {
    // if (err.name === "UnauthorizedError") {
    return res.status(401).send();
  }
});

app.use("/api", routing);

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
