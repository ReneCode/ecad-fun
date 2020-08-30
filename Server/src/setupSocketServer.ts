import socketIO from "socket.io";
import http from "http";
import debug from "debug";

import { ChangeDataType } from "./types";
import clientService from "./ClientService";
import projectService from "./ProjectService";

const socketDebug = debug("socket");

export function setupSocketServer(server: http.Server) {}
