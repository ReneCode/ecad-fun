import { Project } from "../src/Project";

describe("core", () => {
  it("dummy", () => {
    expect(1).toBe(1);
  });

  describe("project", () => {
    it("basic createNode, appendChild, insertChild", () => {
      const clientId = "1";
      const flushCallback = jest.fn();
      const project = new Project(clientId, "abc", flushCallback);
      expect(project.id).toBe("0:0");
      expect(project.clientId).toBe(clientId);
      expect(project.key).toBe("abc");
      expect(project.children).toHaveLength(0);

      const page = project.createNode("page");
      expect(page.id).toBe(`${clientId}:1`);
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

    it("flush", () => {
      const clientId = "1";
      const flushCallback = jest.fn();
      const project = new Project(clientId, "project", flushCallback);

      const page = project.createNode("page");
      const pageId = page.id;

      project.flush();
      expect(flushCallback.mock.calls).toHaveLength(1);
      expect(flushCallback.mock.calls[0]).toEqual([
        [
          {
            a: "c",
            n: { id: pageId, name: "page" },
          },
        ],
      ]);

      const lineA = project.createNode("lineA");
      flushCallback.mockReset();
      project.flush();
      expect(flushCallback.mock.calls[0]).toEqual([
        [
          {
            a: "c",
            n: { id: lineA.id, name: lineA.name },
          },
        ],
      ]);
    });
  });
});
