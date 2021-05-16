import { EditLogType } from "./ecadfun.d";
import { Project } from "./Project";

type SendToServerCallback = (id: number, edit: EditLogType) => void;

class ClientSendEditsQue {
  project: Project;
  sendToServerCallback: SendToServerCallback;
  lastId: number = 0;
  que: { id: number; edit: EditLogType }[] = [];

  constructor(project: Project, sendToServerCallback: SendToServerCallback) {
    this.project = project;
    this.sendToServerCallback = sendToServerCallback;

    this.project.onFlushEdits = (edits: EditLogType[]) => {
      this.que = this.que.concat(
        edits.map((e) => {
          return { id: ++this.lastId, edit: e };
        })
      );

      this.sendEdits();
    };
  }

  sendEdits() {
    for (let q of this.que) {
      console.log("sendEditsToSender:", q.id, q.edit);
      this.sendToServerCallback(q.id, q.edit);
    }
    this.que = [];
  }

  receiveFromServer(
    result: "ack" | "reject" | "ok",
    id: number,
    edit?: EditLogType
  ) {
    if (result === "ack") {
      this.que = this.que.filter((q) => q.id !== id);
    } else if (result === "reject") {
      this.que = this.que.filter((q) => q.id !== id);
      if (!edit) {
        throw new Error("edit missing");
      }
      this.project.applyEdits([edit]);
    } else if (result === "ok") {
      if (!edit) {
        throw new Error("edit missing");
      }
      this.project.applyEdits([edit]);
    }
  }
}

export { ClientSendEditsQue };
