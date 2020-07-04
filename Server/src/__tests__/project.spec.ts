import io from "socket.io-client";
import { SOCKET_URL, wait, attempt } from "../utils";
import { ChangeDataType } from "../types";

describe("project", () => {
  it("open-project => send-clientId", async () => {
    const socket = io(SOCKET_URL);
    const projectId = "docId";
    const fn = jest.fn();

    socket.on("send-clientid", fn);
    socket.emit("open-project", projectId);
    await attempt(() => fn.mock.calls.length > 0);
    socket.close();

    expect(fn.mock.calls.length).toBe(1);
    const expectClientId = 1;
    expect(fn.mock.calls[0][0]).toBe(expectClientId);
  });

  it("open-project => send-project, multi-client", async () => {
    const socketA = io(SOCKET_URL);
    const socketB = io(SOCKET_URL);
    const projectId = "docA";

    const fnA = jest.fn();
    const fnB = jest.fn();
    let gotProjectA = false;
    let gotProjectB = false;

    socketA.on("send-project", (project: any) => {
      fnA(project?.id);
      gotProjectA = true;
    });
    socketB.on("send-project", (project: any) => {
      fnB(project?.id);
      gotProjectB = true;
    });

    socketA.emit("open-project", projectId);
    await attempt(() => {
      return gotProjectA;
    });
    expect(fnA.mock.calls.length).toBe(1);
    expect(fnB.mock.calls.length).toBe(0);

    // if B opens the project than only B should get a "open-project" event
    socketB.emit("open-project", projectId);
    await attempt(() => {
      return gotProjectB;
    });

    socketA.close();
    socketB.close();

    expect(fnA.mock.calls.length).toBe(1);
    expect(fnA.mock.calls[0][0]).toBe(projectId);
    expect(fnB.mock.calls.length).toBe(1);
    expect(fnB.mock.calls[0][0]).toBe(projectId);
  });

  it("change-data", async () => {
    const socket = io(SOCKET_URL);
    const projectId = "docA";

    let clientId: number = 0;
    const fnOpenProject = jest.fn();
    socket.on("send-clientid", (id: number) => {
      clientId = id;
    });
    socket.on("change-data", (changeData: ChangeDataType[]) => {});

    socket.emit("open-project", projectId);
    await attempt(() => {
      return !!clientId;
    });

    const changeData = [
      {
        type: "create",
        obj: {
          id: "1:42",
          type: "page",
          name: "hello",
        },
      },
    ];
    socket.emit("change-data", changeData);

    socket.close();
  });
});
