import { EditLogType } from "./ecadfun.d";
import { Project } from "./Project";
import { wait } from "./wait";

type SendToClientCallbackType = (
  clientId: string,
  result: "ack" | "reject" | "ok",
  messageId: string,
  edits: EditLogType[]
) => void;

class ServerDispatcher {
  project: Project;
  sendToClientCallback: SendToClientCallbackType;
  clientIds: string[] = [];

  constructor(project: Project, sendToClient: SendToClientCallbackType) {
    this.project = project;
    this.sendToClientCallback = sendToClient;
  }

  connectClient(clientId: string) {
    if (this.clientIds.includes(clientId)) {
      throw new Error(`clientId: ${clientId} allready connected`);
    }
    this.clientIds.push(clientId);
  }

  disconnectClient(clientId: string) {
    if (!this.clientIds.includes(clientId)) {
      throw new Error(`clientId: ${clientId} is not connected`);
    }
    this.clientIds = this.clientIds.filter((id) => id != clientId);
  }

  async receiveFromClient(
    clientId: string,
    messageId: string,
    edits: EditLogType[]
  ) {
    if (!this.clientIds.includes(clientId)) {
      throw new Error(`can't receive from not connect client: ${clientId}`);
    }

    await wait();
    const result = this.project.applyEdits(edits);
    await wait();
    if (result === "ack") {
      this.sendToClientCallback(clientId, "ack", messageId, []);
    } else {
      this.sendToClientCallback(clientId, "reject", messageId, edits);
    }
    this.clientIds
      .filter((id) => id !== clientId)
      .forEach((otherClientId) => {
        this.sendToClientCallback(otherClientId, "ok", messageId, edits);
      });
  }
}

export { ServerDispatcher };
