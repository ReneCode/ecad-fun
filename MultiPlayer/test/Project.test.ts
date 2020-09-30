import { Project } from "../src/Project";

describe("Project", () => {
  it("create Project", () => {
    const project = new Project("a");
    const root = project.getRoot();

    expect(project).toBeTruthy();
    const r2 = project.getRoot();
    expect(r2).toEqual({ id: "0:0", _type: "project", projectId: "a" });
  });

  it("project.id", () => {
    const project = new Project("new");
    expect(project.id).toEqual("new");
  });

  it("createObject", () => {
    const project = new Project("a");
    const o = project.createObject({ id: "0:1", name: "hello" });
    expect(o).toEqual({ id: "0:1", name: "hello" });
  });

  it("createObject, project-clientId 0 - different clientId is ok", () => {
    const project = new Project("a");
    project.setClientId(0);
    expect(project.createObject({ id: "2:0", name: "hello" })).toEqual({
      id: "2:0",
      name: "hello",
    });
  });

  it("createObject, project-clientId > 0 - different clientId throws error", () => {
    const project = new Project("a");
    project.setClientId(1);
    expect(() => project.createObject({ id: "2:0", name: "hello" })).toThrow();
  });

  it("createObject - throw on bad id", () => {
    const project = new Project("a");
    expect(() => project.createObject({ id: "", name: "hello" })).toThrow();
  });

  it("append to root", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const fn = jest.fn();
    project.subscribe("create-object", fn);

    const child = { id: "0:1", _type: "page", _parent: `${root.id}-5` };
    const c = project.createObject(child);
    expect(c).toEqual(child);
    const r2 = project.getRoot();
    expect(r2).toHaveProperty("_children", [child]);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(child);
  });

  it("update root-object", () => {
    const project = new Project("a");
    const root = project.getRoot();
    const fn = jest.fn();
    project.subscribe("update-object", fn);

    const update = { ...root, name: "newName" };
    const result = project.updateObject(update);
    expect(result.name).toEqual("newName");
    expect(result.id).toEqual(root.id);
    const r = project.getRoot();
    expect(r).toHaveProperty("id", "0:0");
    expect(r).toHaveProperty("name", "newName");

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toBeCalledWith(update);
  });

  it("append children to root", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const c1 = { id: "0:1", _type: "p1", _parent: `${root.id}-5` };
    const c2 = { id: "0:2", _type: "p2", _parent: `${root.id}-6` };
    const c3 = { id: "0:3", _type: "p3", _parent: `${root.id}-7` };
    project.createObject(c3);
    let r = project.getRoot();
    expect(r).toHaveProperty("_children", [c3]);

    project.createObject(c1);
    r = project.getRoot();
    expect(r).toHaveProperty("_children", [c1, c3]);

    project.createObject(c2);
    r = project.getRoot();
    expect(r).toHaveProperty("_children", [c1, c2, c3]);
  });

  it("append children with same fIndex to root", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const c1 = { id: "0:1", name: "p1", _parent: `${root.id}-4` };
    const c2 = { id: "0:2", name: "p2", _parent: `${root.id}-3` };
    const c3 = { id: "0:3", name: "p3", _parent: `${root.id}-4` };
    expect(project.createObject(c1)).toHaveProperty("_parent", `${root.id}-4`);
    expect(project.createObject(c2)).toHaveProperty("_parent", `${root.id}-3`);
    // change fIndex
    expect(project.createObject(c3)).toHaveProperty("_parent", `${root.id}-5`);
    let r = project.getRoot();
    expect(r._children?.map((o) => o.name)).toEqual(["p2", "p1", "p3"]);
  });

  it("update object - return only changes", () => {
    const project = new Project("a");

    const id = project.createNewId();
    const p1 = { id, name: "p1", type: "page" };
    project.createObject(p1);
    const changes = project.updateObject({ id, name: "p2" });
    // only changes
    expect(changes).toEqual({ id, name: "p2" });
    // complete object
    expect(project.getObject(id)).toEqual({
      id,
      type: "page",
      name: "p2",
    });
  });

  it("update parent", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const page1 = { id: "0:1", name: "p1", _parent: `${root.id}-5` };
    project.createObject(page1);
    const page2 = { id: "0:2", name: "p2", _parent: `${root.id}-6` };
    project.createObject(page2);

    let p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    let p2 = project.getObject(page2.id);
    expect(p2).toHaveProperty("name", "p2");

    const element = { id: "0:3", name: "line", _parent: `${page1.id}-5` };
    project.createObject(element);
    p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    expect(p1).toHaveProperty("_children", [element]);

    const update = { id: element.id, _parent: `${page2.id}-5` };
    expect(project.updateObject(update)).toEqual({
      id: element.id,
      _parent: `${page2.id}-5`,
    });
    const e = project.getObject(element.id);
    expect(e).toEqual({
      id: element.id,
      _parent: `${page2.id}-5`,
      name: "line",
    });

    // removed from p1
    p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    expect(p1).toHaveProperty("_children", []);

    // added to p2
    p2 = project.getObject(page2.id);
    expect(p2).toHaveProperty("name", "p2");
    expect(p2).toHaveProperty("_children", [{ ...element, ...update }]);
  });

  it("delete object", () => {
    const project = new Project("a");
    const root = project.getRoot();
    const fn = jest.fn();
    project.subscribe("delete-object", fn);

    const page1 = { id: "0:1", name: "p1", _parent: `${root.id}-5` };
    project.createObject(page1);

    project.deleteObject(page1.id);
    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page1.id)).toBeUndefined();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(page1.id);
  });

  it("delete object with childs", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const page = { id: "0:1", name: "page", _parent: `${root.id}-5` };
    project.createObject(page);
    const element = project.createObject({
      id: "0:2",
      name: "line",
      _parent: `${page.id}-1`,
    });

    project.deleteObject(page.id);

    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page.id)).toBeUndefined();
    expect(project.getObject(element.id)).toBeUndefined();
  });

  it("createNewId", () => {
    const project = new Project("new");

    const idA = project.createNewId();
    expect(idA).toEqual("0:1");
    const idB = project.createNewId();
    expect(idB).toEqual("0:2");
  });

  it("createNewId considers existing objectIds", () => {
    const project = new Project("a");
    const root = project.getRoot();

    project.createObject({ id: "0:2", name: "page", _parent: `${root.id}-5` });

    const id = project.createNewId();
    expect(id).toEqual("0:3");
  });

  it("setRoot", () => {
    const pA = new Project("a");
    let rA = pA.getRoot();
    const rootIdA = rA.id;
    const page1 = pA.createObject({
      id: "0:2",
      name: "page",
      _parent: `${rootIdA}-5`,
    });
    rA = pA.getRoot();
    expect(rA._children).toEqual([page1]);

    const pB = new Project("b");
    pB.setRoot(rA);
    const rB = pB.getRoot();
    expect(rB.id).toEqual(rootIdA);
    expect(rB._children).toEqual([page1]);
    expect(pB.getObject(page1.id).id).toEqual(page1.id);
  });

  it("setClientId", () => {
    const project = new Project("abc");
    project.setClientId(4);

    const id = project.createNewId();
    expect(id).toEqual("4:0");
  });

  it("setClientId twice => throw error", () => {
    const project = new Project("abc");
    project.setClientId(4);

    expect(() => project.setClientId(5)).toThrow();
  });

  it("setClientId + createObject", () => {
    const project = new Project("ABC");
    project.setClientId(3);
    const o = project.createObject({ id: "3:7", name: "test" });

    const id = project.createNewId();
    expect(id).toEqual("3:8");
  });

  it("setClientId + createObject with bad clienId", () => {
    const project = new Project("ABC");
    project.setClientId(3);
    expect(() => project.createObject({ id: "5:0", name: "test" })).toThrow();
  });

  it("createObjects will increment id-counter", () => {
    const project = new Project("ABC");
    project.setClientId(1);
    project.createObject({ id: "1:5", name: "p1" });
    project.createObject({ id: "1:10", name: "p2" });
    project.createObject({ id: "1:20", name: "p3" });

    const id = project.createNewId();
    expect(id).toEqual("1:21");
  });
});
