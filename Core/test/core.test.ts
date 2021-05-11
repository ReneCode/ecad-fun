import { Project } from "../src/Project";

describe("core", () => {
  it("dummy", () => {
    expect(1).toBe(1);
  });

  describe("project", () => {
    it("basic", () => {
      const clientId = "1";
      const project = new Project(clientId, "abc");
      expect(project.clientId).toBe(clientId);
      expect(project.key).toBe("abc");
      const projectId = project.id;

      const page = project.createNode(projectId, "page");
      expect(page.parent).toBe("0:0/1");
      expect(page.id).toBe(`${clientId}:1`);
      expect(project.children.length).toBe(1);

      const lineA = project.createNode(page.id, "lineA");
      expect(lineA.parent).toBe("1:1/1");
      expect(lineA.id).toBe(`${clientId}:2`);
      expect(page.children.length).toBe(1);

      const lineB = project.createNode(page.id, "lineB");
      expect(lineB.parent).toBe("1:1/2");
      expect(lineB.id).toBe(`${clientId}:3`);
      expect(page.children.length).toBe(2);
    });
  });
});
