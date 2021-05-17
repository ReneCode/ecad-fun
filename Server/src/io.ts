require("dotenv").config();
import http from "http";

import debug from "debug";
import { clientService } from "./ObjectStore/ClientService";
import { projectService } from "./ProjectService";
import { CUDType, ObjectType } from "./share/types";
import { Socket } from "socket.io";

const socketDebug = debug("socket");
const errorDebug = debug("error");

export const initSocketIO = (server: http.Server) => {
  //setupSocketServer(server);

  // cors
  // https://socket.io/docs/v3/handling-cors/
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.APP_ORIGIN,
      allowedHeaders: ["X-ECAD-FUN"],
    },
    // handlePreflightRequest: (req: any, res: any) => {
    //   const headers = {
    //     "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //     "Access-Control-Allow-Origin": req.header ? req.header.origin : "*",
    //     "Access-Control-Allow-Credentials": true,
    //   };
    //   res.writeHead(200, headers);
    //   res.end();
    // },
  });

  io.on("connection", (socket: Socket) => {
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
        socketDebug(`join projectId:${projectId} socket:${socket.id}`);
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

    socket.on("do-cud", async (cuds: CUDType[]) => {
      const projectId = clientService.getProjectIdBySocketId(socket.id);
      const clientId = `${clientService.getClientIdBySocketId(socket.id)}`;
      // socketDebug(`do-cud projectId:${projectId} socket:${socket.id}`);
      if (projectId) {
        const project = await projectService.open(projectId);
        const result = project.doCUD(cuds);
        // TODO result should be the eventualy fixed data (e.g. f-index fixed because of duplicate f-index)
        socket.emit("do-cud", "ack", result);
        socket.broadcast.to(projectId).emit("do-cud", "ok", cuds);
      } else {
        errorDebug(`no project for socket ${socket.id}`);
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
};
