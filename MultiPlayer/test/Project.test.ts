import { Project } from "../src/Project";

describe("Project", () => {
  it("create Project", () => {
    const project = new Project("a");
    const root = project.getRoot();

    expect(project).toBeTruthy();
    const r2 = project.getRoot();
    expect(r2).toEqual(root);
  });

  it("createObject", () => {
    const project = new Project("a");
    const o = project.createObject({ id: "abc", name: "hello" });
    expect(o).toEqual({ id: "abc", name: "hello" });
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

    const child = { id: "1:0", _type: "page", _parent: `${root.id}-5` };
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

    const c1 = { id: "1:1", _type: "p1", _parent: `${root.id}-5` };
    const c2 = { id: "1:2", _type: "p2", _parent: `${root.id}-6` };
    const c3 = { id: "1:3", _type: "p3", _parent: `${root.id}-7` };
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

    const c1 = { id: "1:1", name: "p1", _parent: `${root.id}-4` };
    const c2 = { id: "1:2", name: "p2", _parent: `${root.id}-3` };
    const c3 = { id: "1:3", name: "p3", _parent: `${root.id}-4` };
    expect(project.createObject(c1)).toHaveProperty("_parent", `${root.id}-4`);
    expect(project.createObject(c2)).toHaveProperty("_parent", `${root.id}-3`);
    // change fIndex
    expect(project.createObject(c3)).toHaveProperty("_parent", `${root.id}-5`);
    let r = project.getRoot();
    expect(r._children?.map((o) => o.name)).toEqual(["p2", "p1", "p3"]);
  });

  it("update parent", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const page1 = { id: "1:1", name: "p1", _parent: `${root.id}-5` };
    project.createObject(page1);
    const page2 = { id: "1:2", name: "p2", _parent: `${root.id}-6` };
    project.createObject(page2);

    let p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    let p2 = project.getObject(page2.id);
    expect(p2).toHaveProperty("name", "p2");

    const element = { id: "1:3", name: "line", _parent: `${page1.id}-5` };
    project.createObject(element);
    p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    expect(p1).toHaveProperty("_children", [element]);

    const update = { id: element.id, _parent: `${page2.id}-5` };
    expect(project.updateObject(update)).toHaveProperty("name", "line");
    const e = project.getObject(element.id);

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

    const page1 = { id: "1:1", name: "p1", _parent: `${root.id}-5` };
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

    const page = { id: "1:1", name: "page", _parent: `${root.id}-5` };
    project.createObject(page);
    const element = project.createObject({
      id: "1:2",
      name: "line",
      _parent: `${page.id}-1`,
    });

    project.deleteObject(page.id);

    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page.id)).toBeUndefined();
    expect(project.getObject(element.id)).toBeUndefined();
  });

  // it("change-objects", () => {
  //   const project = new Project("a");

  //   const fn = jest.fn();
  //   project.subscribe("change-object", fn);

  //   const pageA = {
  //     id: "1:0",
  //     name: "pageA",
  //     _parent: `${project.getRoot().id}-5`,
  //   };
  //   const pageB = {
  //     id: "1:1",
  //     name: "pageB",
  //     _parent: `${project.getRoot().id}-5`,
  //   };
  //   project.changeObject([
  //     {
  //       c: pageA,
  //     },
  //     {
  //       c: pageB,
  //     },
  //   ]);
  //   expect(fn).toBeCalledTimes(1);
  //   expect(fn).toBeCalledWith([{ c: pageA }, { c: pageB }]);
  // });
});
