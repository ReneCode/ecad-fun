require("dotenv").config();
import express from "express";
import http from "http";
import socketIO from "socket.io";
import debug from "debug";
import projectService from "./ProjectService";
import clientService from "./ClientService";
import { ChangeDataType } from "./types";

const serverDebug = debug("server");
const ioDebug = debug("io");
const socketDebug = debug("socket");

const app = express();
const port = process.env.PORT || 80; // default port to listen

serverDebug("starting ...");

const server = http.createServer(app);

server.listen(port, () => {
  serverDebug(`listening on port: ${port}`);
});

const io = socketIO(server, {
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
  ioDebug("connection established!");
  io.to(`${socket.id}`).emit("init-room");

  socket.on("join-room", (roomID) => {
    socketDebug(`${socket.id} has joined ${roomID}`);
    socket.join(roomID);
    socketDebug(`users in room: ${io.sockets.adapter.rooms[roomID].length}`);
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

  socket.on("open-project", async (projectId) => {
    const clientId = clientService.connectClient(socket.id, projectId);

    socketDebug(`socket:${socket.id} open-project:${projectId}`);
    const project = await projectService.open(projectId);
    if (project) {
      socket.join(projectId);
      const socketId = socket.id;
      io.to(socket.id).emit("send-clientid", clientId);
      io.to(socket.id).emit("send-project", project);
    }
  });

  socket.on("change-data", async (changeData: ChangeDataType[]) => {
    socketDebug(`socket:${socket.id} change-data`);
    const projectId = clientService.getProjectIdBySocketId(socket.id);
    if (projectId) {
      const project = await projectService.get(projectId);
      if (project) {
        const result = await project.changeData(changeData);
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
