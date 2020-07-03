import clientService from "../ClientService";

describe("ClientService", () => {
  beforeEach(() => {});

  it("connect", () => {
    const documentId = "FILE";
    const socketIdA = "SOCKET-A";
    const socketIdB = "SOCKET-B";
    const socketIdC = "SOCKET-C";

    const clientIdA = clientService.connectClient(socketIdA, documentId);
    expect(clientIdA).toBe(1);

    const clientIdB = clientService.connectClient(socketIdB, documentId);
    expect(clientIdB).toBe(2);

    clientService.disconnectClient(socketIdA);

    // recycle disconnected id
    const clientIdC = clientService.connectClient(socketIdC, documentId);
    expect(clientIdC).toBe(1);
  });

  it("connect twice => exception", () => {
    clientService.connectClient("SOCKET-A", "doc-A");
    expect(() => clientService.connectClient("SOCKET-A", "doc-B")).toThrow();
  });
});
