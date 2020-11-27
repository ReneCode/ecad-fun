import { nanoid } from "nanoid";
import io from "socket.io-client";
import { SOCKET_URL, wait, waitUntilTrue } from "./utils";

type ObjectType = { id: string };

const randomId = () => {
  return nanoid(6);
};

describe("socket-io", () => {
  it("init-room / first-in-room", async () => {
    const roomId = "ROOM_42";
    const socket = io(SOCKET_URL);
    let firstInRoom = false;
    let initRoom = false;
    socket.on("init-room", () => {
      initRoom = true;
    });
    socket.on("first-in-room", () => {
      firstInRoom = true;
    });
    socket.emit("join-room", roomId);
    await wait();
    socket.close();
    expect(initRoom).toBeTruthy();
    expect(firstInRoom).toBeTruthy();
  });

  it("two sockets - A should get 'new user: B'", async () => {
    const roomId = "ABC";
    const socketA = io(SOCKET_URL);
    const socketB = io(SOCKET_URL);
    let newUserId = "";
    socketA.on("new-user", (id: any) => {
      newUserId = id;
    });
    socketA.emit("join-room", roomId);
    await wait();
    socketB.emit("join-room", roomId);
    await wait();
    let idSocketB = socketB.id;
    socketA.close();
    socketB.close();

    expect(newUserId).toBe(idSocketB);
  });

  it("open-project", async () => {
    const socketA = io(SOCKET_URL);

    await wait();

    const projectId = "test-a";
    socketA.emit("open-project", projectId);

    let gotData: any = undefined;

    socketA.on("open-project", (data: any) => {
      gotData = data;
    });

    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toEqual([
      {
        id: "0:0",
        _type: "project",
        projectId: projectId,
      },
    ]);

    socketA.close();
  });

  it("create-object single", async () => {
    const { socket } = await openProject("project-b");

    let gotData: any = undefined;
    socket.on("create-object", (res: string, data: any) => {
      gotData = [res, data];
    });

    socket.emit("create-object", [{ id: "1:0", name: "page" }]);
    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toBeTruthy();
    expect(gotData).toEqual(["ack", [{ id: "1:0", name: "page" }]]);

    socket.close();
  });

  it("create-object with bad clientId", async () => {
    const { socket, clientId } = await openProject("project-c");

    socket.on("create-object", (res: string, data: any) => {
      gotData = [res, data];
    });

    let gotData: any = undefined;
    socket.on("create-object", (res: string, data: any) => {
      gotData = [res, data];
    });

    socket.emit("create-object", [{ id: "35:0", name: "page" }]);
    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toBeTruthy();
    expect(gotData).toEqual(["err", { id: "35:0", name: "page" }]);

    socket.close();
  });

  it("update-object single - get only changes", async () => {
    const { socket } = await openProject("project-d");

    let gotData: any = undefined;
    socket.on("update-object", (res: string, data: any) => {
      gotData = [res, data];
    });

    socket.emit("create-object", [{ id: "1:0", name: "p1", type: "page" }]);
    await wait();
    socket.emit("update-object", [{ id: "1:0", name: "p2" }]);
    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toEqual(["ack", [{ id: "1:0", name: "p2" }]]);

    socket.close();
  });

  it("delete-object single", async () => {
    const { socket } = await openProject("project-d");

    let gotData: any = undefined;
    socket.on("delete-object", (res: string, data: any) => {
      gotData = [res, data];
    });

    socket.emit("create-object", [{ id: "1:0", name: "page" }]);
    await wait();
    socket.emit("delete-object", ["1:0"]);
    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toEqual(["ack", "1:0"]);

    socket.close();
  });
});

///////////////////////////////////////////////////

const openProject = async (projectId: string) => {
  const socket = io(SOCKET_URL);
  await wait();

  let clientId: any = undefined;
  socket.on("send-clientid", (id: number) => {
    clientId = id;
  });
  socket.emit("open-project", projectId);
  let gotData: any = undefined;
  socket.on("open-project", (data: any) => {
    gotData = data;
  });

  await waitUntilTrue(() => gotData !== undefined && !!clientId);
  expect(clientId).not.toBeUndefined();
  return { socket, clientId: clientId as number };
};
