type ClientRecord = {
  socketId: string;
  projectId: string;
  clientId: number;
};

// TODO that has to be persistent database
let clientRecordDb: ClientRecord[] = [];

class ClientService {
  // for testing
  reset() {
    clientRecordDb = [];
  }

  getProjectIdBySocketId(socketId: string) {
    const r = clientRecordDb.find((r) => r.socketId === socketId);
    return r?.projectId;
  }

  getClientIdBySocketId(socketId: string) {
    const r = clientRecordDb.find((r) => r.socketId === socketId);
    return r?.clientId;
  }

  getDataByProjectId(projectId: string) {
    return clientRecordDb
      .filter((r) => r.projectId === projectId)
      .map((r) => {
        return { socketId: r.socketId, clientId: r.clientId };
      });
  }

  /**
   * saves combination socketId + projectId and create a unique clientId
   * @return clientId
   */
  public connectClient(socketId: string, projectId: string): number {
    if (!socketId || !projectId) {
      throw new Error("ClientService.connectClient bad parameters");
    }
    if (this.clientAlreadyConnected(socketId)) {
      throw new Error(`client with socketId: ${socketId} already connected`);
    }
    const clientId = this.getNextClientIdForProject(projectId);
    this.add(socketId, projectId, clientId);
    return clientId;
  }

  public disconnectClient(socketId: string) {
    this.remove(socketId);
  }

  // --------------------------

  private clientAlreadyConnected(socketId: string) {
    return !!clientRecordDb.find((r) => r.socketId === socketId);
  }

  private getNextClientIdForProject(projectId: string) {
    const ids = clientRecordDb
      .filter((r) => r.projectId === projectId)
      .map((r) => r.clientId)
      .sort((a, b) => a - b);

    if (ids.length === 0) {
      return 1;
    } else {
      // try to find a gap in the clientIds to re-use
      for (let i = 0; i < ids.length; i++) {
        const checkId = i + 1;
        if (ids[i] > checkId) {
          return checkId;
        }
      }
      return ids.length + 1;
    }
  }

  private add(socketId: string, projectId: string, clientId: number) {
    const record: ClientRecord = { socketId, projectId, clientId };
    clientRecordDb.push(record);
  }

  private remove(socketId: string) {
    clientRecordDb = clientRecordDb.filter((r) => r.socketId !== socketId);
  }
}

export const clientService = new ClientService();
