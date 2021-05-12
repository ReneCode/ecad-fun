import { Project, Node } from "../src/Project";

describe("core", () => {
  it("dummy", () => {
    expect(1).toBe(1);
  });

  describe("project", () => {
    it("basic createNode, appendChild, insertChild", () => {
      const clientId = "1";
      const flushEditsCallback = jest.fn();
      const project = new Project(clientId, "abc", flushEditsCallback);
      expect(project.id).toBe("0:0");
      expect(project.clientId).toBe(clientId);
      expect(project.key).toBe("abc");
      expect(project.children).toHaveLength(0);

      const page = project.createNode("page");
      expect(page.id).toBe(`${clientId}:1`);
      expect(page.project).toBe(project);
      project.appendChild(page);
      expect(page.parent).toBe("0:0/1");
      expect(project.children).toHaveLength(1);
      {
        const lineA = project.createNode("lineA");
        expect(lineA.id).toBe(`${clientId}:2`);
        page.appendChild(lineA);
        expect(lineA.parent).toBe("1:1/1");
        expect(page.children).toHaveLength(1);
      }
      {
        const lineB = project.createNode("lineB");
        expect(lineB.parent).toBe("");
        expect(lineB.id).toBe(`${clientId}:3`);
        page.appendChild(lineB);
        expect(lineB.parent).toBe("1:1/2");
        expect(page.children).toHaveLength(2);
      }
      {
        const lineC = project.createNode("lineC");
        expect(lineC.id).toBe(`${clientId}:4`);
        page.insertChild(1, lineC);
        expect(lineC.parent).toBe("1:1/1V");

        const names = page.children.map((n) => n.name);
        expect(names).toEqual(["lineA", "lineC", "lineB"]);
      }
      {
        const lineD = project.createNode("lineD");
        expect(lineD.id).toBe(`${clientId}:5`);
        page.insertChild(0, lineD);
        expect(lineD.parent).toBe("1:1/0z");

        const names = page.children.map((n) => n.name);
        expect(names).toEqual(["lineD", "lineA", "lineC", "lineB"]);
      }
    });

    it("export", () => {
      const clientId = "1";
      const flushEditsCallback = jest.fn();
      const project = new Project(clientId, "abc", flushEditsCallback);
      const page = project.createNode("page");
      project.appendChild(page);
      const lineA = project.createNode("lineA");
      page.appendChild(lineA);
      const lineB = project.createNode("lineB");
      page.appendChild(lineB);
      const lineC = project.createNode("lineC");
      page.insertChild(1, lineC);
      const lineD = project.createNode("lineD");
      page.insertChild(0, lineD);
      const filter = (node: Node) => {
        console.log(node.id);
        return true;
      };
      const json = project.export();
      expect(json).toEqual([
        { parent: "0:0/1", id: "1:1", name: "page" },
        { parent: "1:1/0z", id: "1:5", name: "lineD" },
        { parent: "1:1/1", id: "1:2", name: "lineA" },
        { parent: "1:1/1V", id: "1:4", name: "lineC" },
        { parent: "1:1/2", id: "1:3", name: "lineB" },
      ]);
    });

    it("flush", () => {
      const clientId = "1";
      const flushEditsCallback = jest.fn();
      const project = new Project(clientId, "project", flushEditsCallback);

      const page = project.createNode("page");
      const pageId = page.id;

      project.flushEdits();
      expect(flushEditsCallback.mock.calls).toHaveLength(1);
      expect(flushEditsCallback.mock.calls[0]).toEqual([
        [
          {
            a: "c",
            n: { id: pageId, name: "page" },
          },
        ],
      ]);

      flushEditsCallback.mockReset();
      const lineA = project.createNode("lineA");
      page.appendChild(lineA);
      const parentLineA = lineA.parent;
      expect(parentLineA).toEqual("1:1/1");

      const lineB = project.createNode("lineB");
      page.insertChild(0, lineB);
      project.flushEdits();
      expect(flushEditsCallback.mock.calls[0]).toEqual([
        [
          {
            a: "c",
            n: { id: lineA.id, name: lineA.name },
          },
          {
            a: "u",
            n: { id: lineA.id, parent: "1:1/1" },
          },
          {
            a: "c",
            n: { id: lineB.id, name: lineB.name },
          },
          {
            a: "u",
            n: { id: lineB.id, parent: "1:1/0z" },
          },
        ],
      ]);
    });
  });
});
