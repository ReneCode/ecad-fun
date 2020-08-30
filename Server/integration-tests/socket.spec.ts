import io from "socket.io-client";
import { SOCKET_URL, wait } from "./utils";

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
});
