require("dotenv").config();
import express from "express";
import http from "http";
import socketIO from "socket.io";
import debug from "debug";
import documentService from "./DocumentService";

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

  socket.on("open-document", async (documentId) => {
    socketDebug(`socket:${socket.id} open-document:${documentId}`);
    const document = await documentService.open(documentId);
    if (document) {
      socket.join(documentId);
      // if (io.sockets.adapter.rooms[documentId].length <= 1) {
      const socketId = socket.id;
      io.to(socket.id).emit("send-document", document);
      // }
    }
  });

  socket.on("disconnecting", () => {
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
