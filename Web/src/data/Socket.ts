import io from "socket.io-client";
import { Project, ObjectType } from "../share";

const WS_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER as string;

export class Socket {
  private socket: SocketIOClient.Socket | undefined;

  init(project: Project, callbackRedraw: () => void) {
    console.log("socket init:", WS_SERVER);
    this.socket = io(WS_SERVER);

    // register callbacks
    this.socket.on("open-project", (data: any) => {
      // console.log("got open-project:", data);
      project.load(data);
      callbackRedraw();
    });

    this.socket.on("send-clientid", (clientId: string) => {
      console.log("set clientId", clientId);
      project.setClientId(parseInt(clientId));
    });

    this.socket.on("create-object", (response: string, data: ObjectType[]) => {
      if (response === "ack") {
        // it's the answer of my own creating.
        // so I have nothing to do done
      } else {
        // it's the answer of some other client creating
        // so I have to follow that creating
        project.createObjects(data);
        callbackRedraw();
      }
    });

    this.socket.on("update-object", (response: string, data: ObjectType[]) => {
      if (response === "ack") {
        // done
      } else {
        project.updateObjects(data);
        callbackRedraw();
      }
    });

    this.socket.on("delete-object", (response: string, data: string[]) => {
      if (response === "ack") {
        // done
      } else {
        project.deleteObjects(data);
        callbackRedraw();
      }
    });

    this.socket.on("connect_failed", (a: any, b: any) => {
      console.log(">> connect_failed", a, b);
    });

    // open that project
    this.socket.emit("open-project", project.id);
  }

  public exit() {
    this.socket?.disconnect();
  }

  public emit(event: string, ...args: any[]) {
    this.socket?.emit(event, ...args);
  }
}
