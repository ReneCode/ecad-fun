import { EditLogType } from "./ecadfun.d";
import { Project } from "./Project";
import { wait } from "./wait";

type SendToClientCallbackType = (
  clientId: string,
  result: "ack" | "reject" | "force",
  id: number,
  edit?: EditLogType
) => void;

class ServerDispatcher {
  project: Project;
  sendToClientCallback: SendToClientCallbackType;
  clientIds: string[] = [];
  delayBeforeSendToClients = 0;

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

  async receiveFromClient(clientId: string, id: number, edit: EditLogType) {
    if (!this.clientIds.includes(clientId)) {
      throw new Error(`can't receive from not connect client: ${clientId}`);
    }

    // await wait(1000);
    const result = this.project.applyEdits([edit]);
    if (this.delayBeforeSendToClients) {
      await wait(this.delayBeforeSendToClients);
    }
    if (result === "ack") {
      this.sendToClientCallback(clientId, "ack", id, undefined);
    } else {
      this.sendToClientCallback(clientId, "reject", id, edit);
    }

    // send to other clients
    this.clientIds
      .filter((id) => id !== clientId)
      .forEach((otherClientId) => {
        this.sendToClientCallback(otherClientId, "force", id, edit);
      });
  }
}

export { ServerDispatcher };
