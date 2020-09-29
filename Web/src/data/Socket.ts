import io from "socket.io-client";
import { Project, ObjectType } from "multiplayer";

const WS_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER as string;

export class Socket {
  private socket: SocketIOClient.Socket;
  private project: Project;

  constructor(project: Project) {
    this.project = project;
    this.socket = io(WS_SERVER);

    // register callbacks
    this.socket.on("open-project", (data: any) => {
      console.log("got open-project >>", data);
      project.setRoot(data);
      console.log("project:", data);
    });

    this.socket.on("create-object", (response: string, data: ObjectType) => {
      console.log(">>> createObject", response, data);
      if (response === "ack") {
        // done
      } else {
        project.createObject(data);
      }
    });

    // open that project
    this.socket.emit("open-project", project.id);
  }

  public exit() {
    this.socket.disconnect();
  }

  public emit(event: string, ...args: any[]) {
    this.socket.emit(event, ...args);
  }

  // project.subscribe("create-object", (data: ObjectType) => {
  //   console.log("createObject", data);
  //   socket.emit("create-object", data);
  // });
  // project.subscribe("update-object", (data: any) => {
  //   socket.emit("update-object", data);
  // });
  // project.subscribe("delete-object", (data: any) => {
  //   socket.emit("delete-object", data);
  // });
}
