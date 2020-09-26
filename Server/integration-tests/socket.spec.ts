import { nanoid } from "nanoid";
import io from "socket.io-client";
import { SOCKET_URL, wait, waitUntilTrue } from "./utils";
import {} from "nanoid";

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

    const projectId = randomId();
    socketA.emit("open-project", projectId);

    let gotData: any = undefined;

    socketA.on("open-project", (data: any) => {
      gotData = data;
    });

    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toEqual({ _id: "0:0", _type: "project" });

    socketA.close();
  });

  it("create-object single", async () => {
    const socket = await openProject();

    let gotData: any = undefined;
    socket.on("create-object", (data: any) => {
      gotData = data;
    });

    socket.emit("create-object", { _id: "1:0", name: "page" });
    await waitUntilTrue(() => gotData !== undefined);
    expect(gotData).toBeTruthy();
    expect(gotData).toEqual({ _id: "1:0", name: "page" });

    socket.close();
  });
});

it("delete-object single", async () => {
  const socket = await openProject();

  let gotId: string = undefined;
  socket.on("delete-object", (id: string) => {
    gotId = id;
  });

  socket.emit("create-object", { _id: "1:0", name: "page" });
  await wait();
  socket.emit("delete-object", "1:0");
  await waitUntilTrue(() => gotId !== undefined);
  expect(gotId).toEqual("1:0");

  socket.close();
});

const openProject = async (projectId: string = "") => {
  const socket = io(SOCKET_URL);
  await wait();
  socket.emit("open-project", projectId ? projectId : randomId());
  let gotData: any = undefined;
  socket.on("open-project", (data: any) => {
    gotData = data;
  });

  await waitUntilTrue(() => gotData !== undefined);
  return socket;
};
