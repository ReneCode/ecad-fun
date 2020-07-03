type ClientRecord = {
  socketId: string;
  documentId: string;
  clientId: number;
};

// TODO that has to be persistent database
let clientRecordDb: ClientRecord[] = [];

class ClientService {
  constructor() {}

  // return clientId
  public connectClient(socketId: string, documentId: string): number {
    if (this.clientAlreadyConnected(socketId)) {
      throw new Error(`client with socketId: ${socketId} already connected`);
    }
    const clientId = this.getNextClientIdForDocument(documentId);
    this.add(socketId, documentId, clientId);
    return clientId;
  }

  public disconnectClient(socketId: string) {
    this.remove(socketId);
  }

  // --------------------------

  private clientAlreadyConnected(socketId: string) {
    return !!clientRecordDb.find((r) => r.socketId === socketId);
  }

  private getNextClientIdForDocument(documentId: string) {
    const ids = clientRecordDb
      .filter((r) => r.documentId === documentId)
      .map((r) => r.clientId)
      .sort((a, b) => a - b);

    if (ids.length === 0) {
      return 1;
    } else {
      for (let i = 0; i < ids.length; i++) {
        const checkId = i + 1;
        if (ids[i] > checkId) {
          return checkId;
        }
      }
      return ids.length + 1;
    }
  }

  private add(socketId: string, documentId: string, clientId: number) {
    const record: ClientRecord = { socketId, documentId, clientId };
    clientRecordDb.push(record);
  }

  private remove(socketId: string) {
    clientRecordDb = clientRecordDb.filter((r) => r.socketId !== socketId);
  }
}

const clientService = new ClientService();

export default clientService;
