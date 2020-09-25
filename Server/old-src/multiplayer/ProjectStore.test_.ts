import ProjectStore from "./ProjectStore";
import { ChangeDataType, BaseElement } from "../types";

describe("Project", () => {
  it("push - create", async () => {
    const project = new ProjectStore("new");
    const id = "1:0";
    const p1: BaseElement = { id: id, name: "page-1", type: "page" };
    const change: ChangeDataType[] = [{ type: "create", element: p1 }];
    const ok = await project.push(change);
    expect(ok).toBe(true);
    expect(project.getElements()[id]).toEqual(p1);
  });

  it("push - create duplicate id", async () => {
    const project = new ProjectStore("new");
    const id = "1:0";
    const p1: BaseElement = { id: id, name: "page-1", type: "page" };
    await project.push([{ type: "create", element: p1 }]);

    const p2: BaseElement = { id: id, name: "page-2", type: "page" };
    const ok = await project.push([{ type: "create", element: p1 }]);
    expect(ok).toBe(false);
    expect(project.getElements()[id]).toEqual(p1);
  });

  it("push - update", async () => {
    const project = new ProjectStore("new");
    const p1: BaseElement = { id: "1:0", name: "page-1", type: "page", x: 46 };
    await project.push([{ type: "create", element: p1 }]);

    const update: BaseElement = { id: "1:0", name: "new-page-2", y: 55 };
    const ok = await project.push([{ type: "update", element: update }]);
    expect(ok).toBe(true);
    const ele = project.getElements()["1:0"];
    expect(ele).toBeTruthy();
    expect(ele).toHaveProperty("x", 46);
    expect(ele).toHaveProperty("y", 55);
    expect(ele).toHaveProperty("name", "new-page-2");
  });

  it("push - delete", async () => {
    const project = new ProjectStore("new");
    const p1: BaseElement = { id: "1:0", name: "page-1", type: "page" };
    const p2: BaseElement = { id: "1:1", name: "page-2", type: "page" };
    await project.push([
      { type: "create", element: p1 },
      { type: "create", element: p2 },
    ]);

    expect(project.getElements()["1:0"]).toBeTruthy();
    expect(project.getElements()["1:1"]).toBeTruthy();

    const ok = await project.push([{ type: "delete", element: { id: "1:1" } }]);
    expect(project.getElements()["1:0"]).toBeTruthy();
    expect(project.getElements()["1:1"]).toBeFalsy();
  });

  it("pull", async () => {
    const project = new ProjectStore("new");
    const p1: BaseElement = { id: "1:0", name: "page-1", type: "page" };
    const p2: BaseElement = { id: "1:1", name: "page-2", type: "page" };
    await project.push([
      { type: "create", element: p1 },
      { type: "create", element: p2 },
    ]);

    const allPage = await project.pull({ type: "page" });
    expect(allPage).toHaveLength(2);

    const pages = await project.pull({ type: "page", name: "page-1" });
    expect(pages).toHaveLength(1);

    const elements = await project.pull({ type: "device" });
    expect(elements).toHaveLength(0);
  });

  /*
  it.skip("change - create,update,delete", async () => {
    const project = new ProjectStore("pId");

    let changes: ChangeDataType[] = [
      {
        type: "create",
        element: { id: "1:1", name: "hello", type: "page" },
      },
      {
        type: "create",
        element: { id: "1:2", name: "devA", type: "device" },
      },
      {
        type: "update",
        element: { id: "1:1", name: "PA" },
      },
    ];
    let ok = await project.push(changes);

    expect(ok).toBe(true);
    const o1 = project.getElements()["1:1"];
    expect(o1).toBeTruthy();
    expect(o1).toHaveProperty("type", "page");
    expect(o1).toHaveProperty("name", "PA");
    const o2 = project.getElements()["1:2"];
    expect(o2).toHaveProperty("name", "devA");

    changes = [
      {
        type: "remove",
        element: { id: "1:2" },
      },
      {
        type: "update",
        element: { id: "1:1", name: "page-A" },
      },
    ];
    ok = await project.push(changes);
    expect(ok).toBeTruthy();
    const o3 = project.getElements()["1:1"];
    expect(o3).toBeTruthy();
    expect(o3).toHaveProperty("type", "page");
    expect(o3).toHaveProperty("name", "page-A");

    const o4 = project.getElements()["1:2"];
    expect(o4).toBeFalsy();
  });
  */
});
