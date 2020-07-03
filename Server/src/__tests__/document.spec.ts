import io from "socket.io-client";
import { SOCKET_URL, wait, attempt } from "../utils";

describe("document", () => {
  it("open-document => send-document, multi-client", async () => {
    const socketA = io(SOCKET_URL);
    const socketB = io(SOCKET_URL);
    const documentId = "docA";

    const fnA = jest.fn();
    const fnB = jest.fn();
    let gotDocumentA = false;
    let gotDocumentB = false;

    socketA.on("send-document", (document: any) => {
      fnA(document?.id);
      gotDocumentA = true;
    });
    socketB.on("send-document", (document: any) => {
      fnB(document?.id);
      gotDocumentB = true;
    });

    socketA.emit("open-document", documentId);
    await attempt(() => {
      return gotDocumentA;
    });
    expect(fnA.mock.calls.length).toBe(1);
    expect(fnB.mock.calls.length).toBe(0);

    // if B opens the document than only B should get a "open-document" event
    socketB.emit("open-document", documentId);
    await attempt(() => {
      return gotDocumentB;
    });

    socketA.close();
    socketB.close();

    expect(fnA.mock.calls.length).toBe(1);
    expect(fnA.mock.calls[0][0]).toBe(documentId);
    expect(fnB.mock.calls.length).toBe(1);
    expect(fnB.mock.calls[0][0]).toBe(documentId);
  });

  it("");
});
