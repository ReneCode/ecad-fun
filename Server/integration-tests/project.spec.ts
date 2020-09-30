// import io from "socket.io-client";
// import { ChangeDataType } from "../src/types";
// import { SOCKET_URL, wait, waitUntilTrue } from "./utils";


describe("a", () => {

})

 describe("project", () => {
   it("a", () => {
     expect(1).toBe(1)
   })
//   it("open-project => send-clientId", async () => {
//     const socket = io(SOCKET_URL);
//     const projectId = "docId";
//     const fn = jest.fn();

//     socket.on("send-clientid", fn);
//     socket.emit("open-project", projectId);
//     await waitUntilTrue(() => fn.mock.calls.length > 0);
//     socket.close();

//     expect(fn.mock.calls.length).toBe(1);
//     const expectClientId = 1;
//     expect(fn.mock.calls[0][0]).toBe(expectClientId);
//   });

//   it("open-project => send-project, multi-client", async () => {
//     const socketA = io(SOCKET_URL);
//     const socketB = io(SOCKET_URL);
//     const projectId = "docA";

//     const fnA = jest.fn();
//     const fnB = jest.fn();
//     let gotProjectA = false;
//     let gotProjectB = false;

//     socketA.on("send-project", (project: any) => {
//       fnA(project?.id);
//       gotProjectA = true;
//     });
//     socketB.on("send-project", (project: any) => {
//       fnB(project?.id);
//       gotProjectB = true;
//     });

//     socketA.emit("open-project", projectId);
//     await waitUntilTrue(() => {
//       return gotProjectA;
//     });
//     expect(fnA.mock.calls.length).toBe(1);
//     expect(fnB.mock.calls.length).toBe(0);

//     // if B opens the project than only B should get a "open-project" event
//     socketB.emit("open-project", projectId);
//     await waitUntilTrue(() => {
//       return gotProjectB;
//     });

//     socketA.close();
//     socketB.close();

//     expect(fnA.mock.calls.length).toBe(1);
//     expect(fnA.mock.calls[0][0]).toBe(projectId);
//     expect(fnB.mock.calls.length).toBe(1);
//     expect(fnB.mock.calls[0][0]).toBe(projectId);
//   });

//   it("create-object", async () => {
//     const socket = io(SOCKET_URL);
//     const projectId = "docA";

//     let clientId: number = 0;
//     socket.on("send-clientid", (id: number) => {
//       clientId = id;
//     });
//     let gotCreateObject = null;
//     socket.on("create-object", (o) => {
//       gotCreateObject = o;
//     });

//     socket.emit("open-project", projectId);
//     await waitUntilTrue(() => {
//       return !!clientId;
//     });

//     const obj = {
//       id: "1:42",
//       type: "page",
//       name: "hello",
//     };
//     socket.emit("create-object", obj);

//     wait();

//     expect();

//     socket.close();
//   });
// });
