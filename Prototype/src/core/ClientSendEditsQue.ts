import { EditLogType } from "./ecadfun.d";
import { Project } from "./Project";
import { wait } from "./wait";

type SendToServerCallback = (id: number, edit: EditLogType) => void;

class ClientSendEditsQue {
  project: Project;
  sendToServerCallback: SendToServerCallback;
  lastId: number = 0;
  que: { id: number; edit: EditLogType }[] = [];
  delayBeforeSendToServer = 0;

  constructor(project: Project, sendToServerCallback: SendToServerCallback) {
    this.project = project;
    this.sendToServerCallback = sendToServerCallback;

    this.project.onFlushEdits = async (edits: EditLogType[]) => {
      if (this.delayBeforeSendToServer) {
        await wait(this.delayBeforeSendToServer);
      }

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
      this.sendToServerCallback(q.id, q.edit);
    }
    this.que = [];
  }

  receiveFromServer(
    result: "ack" | "reject" | "force",
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
      this.project.applyEdits([edit], true);
    } else if (result === "force") {
      if (!edit) {
        throw new Error("edit missing");
      }
      this.project.applyEdits([edit], true);
    }
  }
}

export { ClientSendEditsQue };
