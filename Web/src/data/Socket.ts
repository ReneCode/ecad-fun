import io from "socket.io-client";
import { Project, CUDType } from "../share";

const WS_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER as string;

export class Socket {
  private socket: SocketIOClient.Socket | undefined;
  private clientId: string = "";

  public getClientId(): string {
    return this.clientId;
  }

  init(
    project: Project,
    callbackProjectOpen: (project: Project) => void,
    callbackProjectChange: (project: Project) => void
  ) {
    console.log("socket init:", WS_SERVER);
    this.socket = io(WS_SERVER);

    // register callbacks
    this.socket.on("open-project", (data: any) => {
      // console.log("got open-project:", data);
      project.load(data);
      callbackProjectOpen(project);
    });

    this.socket.on("send-clientid", (clientId: number) => {
      this.clientId = `${clientId}`;
      console.debug("set clientId", clientId);
      project.setClientId(clientId);
      // callbackInit(project);
    });

    this.socket.on("do-cud", (response: string, data: CUDType[]) => {
      switch (response) {
        case "ack":
          // my do-cud was well performed by the server
          break;
        case "err":
          console.log("do-cud:", response, data);
          break;
        case "ok":
          // some other clients changes
          // follow that changes
          if (!data) {
            throw new Error("bad socket data");
          }
          project.doCUD(data, { withUndo: false });
          callbackProjectChange(project);
          break;
      }
    });
    /*
    this.socket.on("create-object", (response: string, data: ObjectType[]) => {
      if (response === "ack") {
        // it's the answer of my own creating.
        // so I have nothing to do done
      } else {
        // it's the answer of some other client creating
        // so I have to follow that creating
        project.createObjects(data);
        callbackProjectChange(project);
      }
    });

    this.socket.on("update-object", (response: string, data: ObjectType[]) => {
      if (response === "ack") {
        // done
      } else {
        project.updateObjects(data);
        callbackProjectChange(project);
      }
    });

    this.socket.on("delete-object", (response: string, data: string[]) => {
      if (response === "ack") {
        // done
      } else {
        project.deleteObjects(data);
        callbackProjectChange(project);
      }
    });
*/
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
