require("dotenv").config();
import express from "express";
import SocketIO from "socket.io";
const morgan = require("morgan");
import http from "http";
const bodyParser = require("body-parser");

import debug from "debug";
import { setupExpressRouting } from "./routing";
import { setupSocketServer } from "./setupSocketServer";
import clientService from "./ObjectStore/ClientService";
import projectService from "./ProjectService";
import { ChangeObjectType } from "./ObjectStore/types";

const serverDebug = debug("server");
const socketDebug = debug("socket");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(morgan("common"));

setupExpressRouting(app);

app.use("/", (req, res) => {
  res.send("hi cad.fun Server");
});

app.use((req, res, next) => {
  res.status(404).send("Not found");
});

// error handling - should be the last use
app.use((error: any, req: any, res: any, next: any) => {
  // catches all errors of the app
  res.status(error.status || 500);
  res.json({
    error: {
      message: "sorry - some error happens",
    },
  });
});

const port = process.env.PORT || 8080; // default port to listen

serverDebug("starting ...");

const server = http.createServer(app);

//setupSocketServer(server);
const io = SocketIO(server, {
  handlePreflightRequest: function (req, res) {
    var headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.header ? req.header.origin : "*",
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

io.on("connection", (socket) => {
  socketDebug(`${socket.id} connection established!`);
  io.to(`${socket.id}`).emit("init-room");

  socket.on("join-room", (roomID) => {
    socketDebug(`${socket.id} join-room ${roomID}`);
    socket.join(roomID);
    socketDebug(
      `${io.sockets.adapter.rooms[roomID].length} users in room: ${roomID}`
    );
    if (io.sockets.adapter.rooms[roomID].length <= 1) {
      io.to(`${socket.id}`).emit("first-in-room");
    } else {
      socket.broadcast.to(roomID).emit("new-user", socket.id);
    }
    io.in(roomID).emit(
      "room-user-change",
      Object.keys(io.sockets.adapter.rooms[roomID].sockets)
    );
  });

  socket.on("pull", (data) => {
    // pull
  });

  socket.on("push", (data) => {
    // push
  });

  socket.on("open-project", async (projectId) => {
    const clientId = clientService.connectClient(socket.id, projectId);
    io.to(socket.id).emit("send-clientid", clientId);

    socketDebug(`${socket.id} open-project:${projectId}`);
    const project = await projectService.open(projectId);
    if (project) {
      socket.join(projectId);
      io.to(socket.id).emit("open-project", { s: "ok", d: project.getRoot() });
    }
  });

  socket.on("change-object", async (changeObjects: ChangeObjectType[]) => {
    socketDebug(`socket:${socket.id} change-object`);
    const projectId = clientService.getProjectIdBySocketId(socket.id);
    if (projectId) {
      const project = await projectService.open(projectId);
      if (project) {
        const result = project.changeObjects(changeObjects);
        // TODO
        // const result = await project.changeData(changeData);
      }
    }
  });

  socket.on("disconnecting", () => {
    clientService.disconnectClient(socket.id);

    socketDebug("disconnecting...", socket.id);
    const rooms = io.sockets.adapter.rooms;
    for (const roomID in socket.rooms) {
      const clients = Object.keys(rooms[roomID].sockets).filter(
        (id) => id !== socket.id
      );
      if (clients.length > 0) {
        socket.broadcast.to(roomID).emit("room-user-change", clients);
      }
    }
  });

  socket.on("disconnect", () => {
    socketDebug("disconnect");

    socket.removeAllListeners();
  });
});

server.listen(port, () => {
  serverDebug(`listening on port: ${port}`);
});
