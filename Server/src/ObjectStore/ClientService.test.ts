import clientService from "./ClientService";

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

  it("clientIds starts on 1 for each project", () => {
    const socketIdA = "A";
    const socketIdB = "B";
    const projectIdX = "prjX";
    const projectIdY = "prjY";
    expect(clientService.connectClient(socketIdA, projectIdX)).toEqual(1);
    expect(clientService.connectClient(socketIdB, projectIdX)).toEqual(2);
    expect(clientService.connectClient(socketIdA, projectIdY)).toEqual(1);
  });
});
