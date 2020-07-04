import Project from "./Project";
import { ChangeDataType } from "./types";

describe("Project", () => {
  it("create", () => {
    const projectId = "project-id";
    const project = new Project(projectId);

    expect(project.getId()).toBe(projectId);
  });

  it("change - create,update,delete", async () => {
    const project = new Project("pId");

    let changes: ChangeDataType[] = [
      {
        type: "create",
        obj: { id: "1:1", name: "hello", type: "page" },
      },
      {
        type: "create",
        obj: { id: "1:2", name: "devA", type: "device" },
      },
      {
        type: "update",
        obj: { id: "1:1", name: "PA" },
      },
    ];
    let ok = await project.changeData(changes);

    expect(ok).toBe(true);
    const o1 = project.getObjects()["1:1"];
    expect(o1).toBeTruthy();
    expect(o1).toHaveProperty("type", "page");
    expect(o1).toHaveProperty("name", "PA");
    const o2 = project.getObjects()["1:2"];
    expect(o2).toHaveProperty("name", "devA");

    changes = [
      {
        type: "delete",
        obj: { id: "1:2" },
      },
      {
        type: "update",
        obj: { id: "1:1", name: "page-A" },
      },
    ];
    ok = await project.changeData(changes);
    expect(ok).toBeTruthy();
    const o3 = project.getObjects()["1:1"];
    expect(o3).toBeTruthy();
    expect(o3).toHaveProperty("type", "page");
    expect(o3).toHaveProperty("name", "page-A");

    const o4 = project.getObjects()["1:2"];
    expect(o4).toBeFalsy();
  });
});
