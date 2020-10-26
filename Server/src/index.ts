require("dotenv").config();
import express from "express";
import SocketIO from "socket.io";
const morgan = require("morgan");
import http from "http";
const bodyParser = require("body-parser");

import debug from "debug";
import clientService from "./ObjectStore/ClientService";
import { projectService } from "./ProjectService";
import { ObjectType } from "multiplayer";
import projectRouting from "./routing/projectRouting";

const serverDebug = debug("server");
const socketDebug = debug("socket");
const errorDebug = debug("error");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(morgan("common"));

app.use("/project", projectRouting);

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
  socketDebug(`connection ${socket.id}`);
  io.to(`${socket.id}`).emit("init-room");

  socket.on("join-room", (roomID) => {
    // socketDebug(`${socket.id} join-room ${roomID}`);
    socket.join(roomID);
    // socketDebug(
    //   `${io.sockets.adapter.rooms[roomID].length} users in room: ${roomID}`
    // );
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
    if (!projectId) {
      return;
    }

    const clientId = clientService.connectClient(socket.id, projectId);
    io.to(socket.id).emit("send-clientid", clientId);

    socketDebug(`open-project ${socket.id} ${projectId}`);
    const project = await projectService.open(projectId);
    if (project) {
      socket.join(projectId);
      // project.subscribe("create-object", (data) => {
      //   io.to(socket.id).emit("create-object", data);
      // });
      // project.subscribe("update-object", (data) => {
      //   io.to(socket.id).emit("update-object", data);
      // });
      // project.subscribe("delete-object", (data) => {
      //   io.to(socket.id).emit("delete-object", data);
      // });
      const content = project.save();
      io.to(socket.id).emit("open-project", content);
    }
  });

  socket.on("create-object", async (objects: ObjectType[]) => {
    socketDebug(`create-object ${socket.id}`);
    const projectId = clientService.getProjectIdBySocketId(socket.id);
    const clientId = `${clientService.getClientIdBySocketId(socket.id)}`;
    if (projectId) {
      const project = await projectService.open(projectId);
      if (project) {
        // validate clientId of obj.id
        // client is forced to use only its clienId
        let ok = true;
        for (let obj of objects) {
          const [cId, index] = obj.id.split(":");
          if (cId !== clientId) {
            ok = false;
            break;
          }
        }
        if (!ok) {
          //
          socket.emit("create-object", "err", objects);
        } else {
          const result = project.createObjects(objects);
          socket.emit("create-object", "ack", result);
          socket.broadcast.emit("create-object", "ok", result);
        }
      }
    } else {
      errorDebug(`no project for socket ${socket.id}`);
    }
  });

  socket.on("update-object", async (objects: ObjectType[]) => {
    socketDebug(`update-object ${socket.id}`);
    const projectId = clientService.getProjectIdBySocketId(socket.id);
    if (projectId) {
      const project = await projectService.open(projectId);
      if (project) {
        const result = project.updateObjects(objects);
        socket.emit("update-object", "ack", result);
        socket.broadcast.emit("update-object", "ok", result);
      }
    }
  });
  socket.on("delete-object", async (ids: string[]) => {
    socketDebug(`delete-object ${socket.id}`);
    const projectId = clientService.getProjectIdBySocketId(socket.id);
    if (projectId) {
      const project = await projectService.open(projectId);
      if (project) {
        const result = project.deleteObjects(ids);
        socket.emit("delete-object", "ack", result);
        socket.broadcast.emit("delete-object", "ok", result);
      }
    }
  });

  socket.on("disconnecting", () => {
    clientService.disconnectClient(socket.id);

    socketDebug(`disconnect ${socket.id}`);
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
    // socketDebug("disconnect");

    socket.removeAllListeners();
  });
});

server.listen(port, () => {
  serverDebug(`listening on port: ${port}`);
});
