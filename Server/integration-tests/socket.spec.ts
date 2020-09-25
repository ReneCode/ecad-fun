import io from "socket.io-client";
import { SOCKET_URL, wait, waitUntilTrue } from "./utils";

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

    const projectId = "prjA";
    socketA.emit("open-project", projectId);

    let gotData: { s: string; d: any[] } = undefined;

    socketA.on("open-project", (data: any) => {
      gotData = data;
    });

    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toBeTruthy();
    expect(gotData.s).toBe("ok");
    expect(gotData.d).toEqual({ _id: "0:0", _type: "project" });

    socketA.close();
  });

  it("change-object", async () => {
    const socket = await openProject();

    let gotData: { s: string; d: any[] } = undefined;
    socket.on("change-object", (data: any) => {
      gotData = data;
    });

    socket.emit("change-object", [
      { c: { _id: "1:0", name: "page" } }, // create
      { c: { _id: "1:1", name: "line" } }, // create
    ]);
    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toBeTruthy();
    expect(gotData.s).toEqual("ok");
    expect(gotData.d).toEqual([
      { _id: "1:0", name: "page" },
      { _id: "1:1", name: "line" },
    ]);

    socket.emit("change-object", [
      { u: { _id: "1:0", name: "page-name" } }, // update
      { d: "1:1" }, // delete
    ]);

    socket.close();
  });
});

const openProject = async () => {
  const socket = io(SOCKET_URL);
  const projectId = "newProjectId";
  await wait();
  socket.emit("open-project", projectId);
  let gotData: { s: string; d: any[] } = undefined;
  socket.on("open-project", (data) => {
    gotData = data;
  });

  await waitUntilTrue(() => gotData !== undefined);
  return socket;
};
