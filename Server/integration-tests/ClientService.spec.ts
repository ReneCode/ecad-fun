import clientService from "../src/ClientService";

describe("ClientService", () => {
  beforeEach(() => {});

  it("connect", () => {
    const projectId = "FILE";
    const socketIdA = "SOCKET-A";
    const socketIdB = "SOCKET-B";
    const socketIdC = "SOCKET-C";

    const clientIdA = clientService.connectClient(socketIdA, projectId);
    expect(clientIdA).toBe(1);

    const clientIdB = clientService.connectClient(socketIdB, projectId);
    expect(clientIdB).toBe(2);

    clientService.disconnectClient(socketIdA);

    // recycle disconnected id
    const clientIdC = clientService.connectClient(socketIdC, projectId);
    expect(clientIdC).toBe(1);
  });

  it("connect twice => exception", () => {
    clientService.connectClient("SOCKET-A", "doc-A");
    expect(() => clientService.connectClient("SOCKET-A", "doc-B")).toThrow();
  });
});
