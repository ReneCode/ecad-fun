import { EditLogType } from "../src/ecadfun.d";
import { Project, LineNode, Node, PageNode } from "../src/Project";
import { ClientSendEditsQue } from "../src/ClientSendEditsQue";
import { ServerDispatcher } from "../src/ServerDispatcher";
import { wait } from "../src/wait";

describe("multi-user project", () => {
  let projectA: Project;
  let projectB: Project;
  let projectS: Project;
  let clientAProxy: ClientSendEditsQue;
  let clientBProxy: ClientSendEditsQue;
  let serverProxy: ServerDispatcher;

  beforeEach(() => {
    const sendToServer = (
      // clientId: string,
      // result: "ack" | "reject" | "ok",
      // id: number,
      edit: EditLogType
    ) => {};
    projectA = new Project("1", "");
    clientAProxy = new ClientSendEditsQue(
      projectA,
      (id: number, edit: EditLogType) => {
        serverProxy.receiveFromClient(projectA.clientId, id, edit);
      }
    );
    projectB = new Project("2", "");
    clientBProxy = new ClientSendEditsQue(
      projectB,
      (id: number, edit: EditLogType) => {
        serverProxy.receiveFromClient(projectB.clientId, id, edit);
      }
    );
    projectS = new Project("Server", "");
    serverProxy = new ServerDispatcher(
      projectS,
      (
        clientId: string,
        result: "ack" | "reject" | "force",
        id: number,
        edit?: EditLogType
      ) => {
        switch (clientId) {
          case "1":
            clientAProxy.receiveFromServer(result, id, edit);
            break;
          case "2":
            clientBProxy.receiveFromServer(result, id, edit);
            break;
          default:
            throw new Error("bad clientId");
        }
      }
    );
    serverProxy.connectClient("1");
    serverProxy.connectClient("2");
  });

  it("scenario two clients and one server", async () => {
    const pageA = projectA.createPage("pageA");
    projectA.appendChild(pageA);
    expect(pageA).toHaveProperty("id", "1:1");
    expect(pageA).toHaveProperty("parent", "0:0/1");
    expect(projectA.children[0]).toHaveProperty("name", "pageA");
    projectA.flushEdits();

    await wait(100);

    const pageB = projectB.createPage("pageB");
    projectB.appendChild(pageB);
    expect(pageB).toHaveProperty("id", "2:1");
    expect(pageB).toHaveProperty("parent", "0:0/1");
    expect(projectB.children[0]).toHaveProperty("name", "pageB");
    projectB.flushEdits();

    await wait(1200);

    expect(projectS.children[0]).toHaveProperty("name", "pageA");
    expect(projectS.children[0]).toHaveProperty("parent", "0:0/1");
    expect(projectS.children[1]).toHaveProperty("name", "pageB");
    expect(projectS.children[1]).toHaveProperty("parent", "0:0/2");

    expect(projectA.children[0]).toHaveProperty("name", "pageA");
    expect(projectA.children[0]).toHaveProperty("parent", "0:0/1");
    expect(projectA.children[1]).toHaveProperty("name", "pageB");
    expect(projectA.children[1]).toHaveProperty("parent", "0:0/2");

    // expect(projectB.children[0]).toHaveProperty("name", "pageA");
  });
});
