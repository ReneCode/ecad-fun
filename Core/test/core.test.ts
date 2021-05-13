import { Project, LineNode, Node, INode } from "../src/Project";

describe("core project", () => {
  it("getNode", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "abc", flushEditsCallback);
    const page = project.createPage("new page");
    const p = project.getNode(page.id);
    expect(p.name).toBe(page.name);

    // edit
    project.flushEdits();
    flushEditsCallback.mockReset();
    p.name = "new name";
    project.flushEdits();
    expect(flushEditsCallback.mock.calls).toHaveLength(1);
    expect(flushEditsCallback.mock.calls[0]).toHaveLength(1);
    expect(flushEditsCallback.mock.calls[0][0]).toEqual([
      {
        a: "u",
        n: { id: p.id, name: "new name" },
      },
    ]);
  });

  it("basic createNode, appendChild, insertChild", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "abc", flushEditsCallback);
    expect(project.id).toBe("0:0");
    expect(project.clientId).toBe(clientId);
    expect(project.key).toBe("abc");
    expect(project.children).toHaveLength(0);

    const page = project.createPage("page");
    expect(page.id).toBe(`${clientId}:1`);
    expect(page.project).toBe(project);
    project.appendChild(page);
    expect(page.parent).toBe("0:0/1");
    expect(project.children).toHaveLength(1);
    {
      const lineA = project.createLine("lineA");
      expect(lineA.id).toBe(`${clientId}:2`);
      page.appendChild(lineA);
      expect(lineA.parent).toBe("1:1/1");
      expect(page.children).toHaveLength(1);
    }
    {
      const lineB = project.createLine("lineB");
      expect(lineB.parent).toBe("");
      expect(lineB.id).toBe(`${clientId}:3`);
      page.appendChild(lineB);
      expect(lineB.parent).toBe("1:1/2");
      expect(page.children).toHaveLength(2);
    }
    {
      const lineC = project.createLine("lineC");
      expect(lineC.id).toBe(`${clientId}:4`);
      page.insertChild(1, lineC);
      expect(lineC.parent).toBe("1:1/1V");

      const names = page.children.map((n) => n.name);
      expect(names).toEqual(["lineA", "lineC", "lineB"]);
    }
    {
      const lineD = project.createLine("lineD");
      expect(lineD.id).toBe(`${clientId}:5`);
      page.insertChild(0, lineD);
      expect(lineD.parent).toBe("1:1/0z");

      const names = page.children.map((n) => n.name);
      expect(names).toEqual(["lineD", "lineA", "lineC", "lineB"]);
    }
  });

  it.skip("performance", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "abc", flushEditsCallback);

    const maxPage = 100;
    const maxLine = 1000;
    for (let pageIdx = 0; pageIdx < maxPage; pageIdx++) {
      const page = project.createPage(`page-${pageIdx}`);
      project.appendChild(page);
      for (let lineIdx = 0; lineIdx < maxLine; lineIdx++) {
        const line = project.createLine(`line-${lineIdx}`);
        page.appendChild(line);
      }
    }
    const data = project.export();
    expect(data).toHaveLength(maxPage * maxLine + maxPage);
  });

  it("export", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "abc", flushEditsCallback);
    const page = project.createPage("page");
    project.appendChild(page);
    const lineA = project.createLine("lineA");
    page.appendChild(lineA);
    const lineB = project.createLine("lineB");
    page.appendChild(lineB);
    const lineC = project.createLine("lineC");
    page.insertChild(1, lineC);
    const lineD = project.createLine("lineD");
    page.insertChild(0, lineD);
    const json = project.export();
    expect(json).toEqual([
      { parent: "0:0/1", id: "1:1", type: "PAGE", name: "page" },
      { parent: "1:1/0z", id: "1:5", type: "LINE", name: "lineD" },
      { parent: "1:1/1", id: "1:2", type: "LINE", name: "lineA" },
      { parent: "1:1/1V", id: "1:4", type: "LINE", name: "lineC" },
      { parent: "1:1/2", id: "1:3", type: "LINE", name: "lineB" },
    ]);
  });

  it("import", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "abc", flushEditsCallback);

    const data: Partial<INode>[] = [
      { parent: "0:0/1", id: "1:1", type: "PAGE", name: "page" },
      { parent: "1:1/0z", id: "1:5", type: "LINE", name: "lineD" },
      { parent: "1:1/1", id: "1:2", type: "LINE", name: "lineA" },
      { parent: "1:1/1V", id: "1:4", type: "LINE", name: "lineC" },
      { parent: "1:1/2", id: "1:3", type: "LINE", name: "lineB" },
    ];
    const ok = project.import(data);
    // no edits during import
    project.flushEdits();
    expect(flushEditsCallback.mock.calls).toHaveLength(0);

    const lineA = project.getNode("1:2");
    expect(lineA).toBeInstanceOf(LineNode);

    const exportResult = project.export();
    expect(exportResult).toEqual(data);

    // edit after import
    flushEditsCallback.mockReset();
    const page = project.getNode("1:1");
    page.name = "changed-name";
    project.flushEdits();
    expect(flushEditsCallback.mock.calls).toHaveLength(1);
    expect(flushEditsCallback.mock.calls[0][0]).toEqual([
      {
        a: "u",
        n: { id: "1:1", name: "changed-name" },
      },
    ]);
  });

  it("flush", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "project", flushEditsCallback);

    const page = project.createPage("page");
    const pageId = page.id;

    project.flushEdits();
    expect(flushEditsCallback.mock.calls).toHaveLength(1);
    expect(flushEditsCallback.mock.calls[0]).toHaveLength(1);
    expect(flushEditsCallback.mock.calls[0][0]).toEqual([
      {
        a: "c",
        n: { id: pageId, type: "PAGE", name: "page" },
      },
    ]);

    flushEditsCallback.mockReset();
    const lineA = project.createLine("lineA");
    page.appendChild(lineA);
    const parentLineA = lineA.parent;
    expect(parentLineA).toEqual("1:1/1");

    const lineB = project.createLine("lineB");
    page.insertChild(0, lineB);
    project.flushEdits();
    expect(flushEditsCallback.mock.calls[0][0]).toEqual([
      {
        a: "c",
        n: { id: lineA.id, type: "LINE", name: "lineA" },
      },
      {
        a: "u",
        n: { id: lineA.id, parent: "1:1/1" },
      },
      {
        a: "c",
        n: { id: lineB.id, type: "LINE", name: "lineB" },
      },
      {
        a: "u",
        n: { id: lineB.id, parent: "1:1/0z" },
      },
    ]);
  });

  it("update", () => {
    const clientId = "1";
    const flushEditsCallback = jest.fn();
    const project = new Project(clientId, "project", flushEditsCallback);

    const page = project.createPage("page");
    const arc = project.createArc("arc");
    expect(arc.radius).toEqual(10);
    arc.name = "new name";
    arc.radius = 50;

    expect(arc.name).toEqual("new name");
    expect(arc.radius).toEqual(50);

    expect(() => {
      page.id = "page-id";
    }).toThrowError();
    expect(() => {
      arc.id = "42";
    }).toThrowError();
  });
});
