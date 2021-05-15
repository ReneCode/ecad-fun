import { EditLogType } from "../src/ecadfun.d";
import { Project, LineNode, Node, PageNode } from "../src/Project";

describe("multi-user project", () => {
  let clientA: Project;
  let clientB: Project;
  let clientC: Project;
  let server: Project;
  let flushEditsCallback = jest.fn();

  beforeEach(() => {
    flushEditsCallback = jest.fn();
    const sendToServer = (clientId: string, edits: EditLogType[]) => {};
    clientA = new Project("A", "", (edit: EditLogType[]) => {
      sendToServer("A", edit);
    });
    clientB = new Project("B", "", (edit: EditLogType[]) => {
      sendToServer("B", edit);
    });
  });

  it("send ack to sender", () => {
    const pageA = clientA.createPage("page");

    // expect(pageB.children).toHaveLength(1);
  });
});
