import { Project } from "./Project";
import { ObjectType } from "./types";

describe("Project", () => {
  it("create Project", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();

    expect(project).toBeTruthy();
    const r2 = project.getRoot();
    expect(r2).toEqual(root);
  });

  it("append to root", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();

    const fn = jest.fn();
    project.subscribe("create-object", fn);

    const child = { _id: "1:0", _type: "page", _parent: `${root._id}-5` };
    const c = project.createObject(child);
    expect(c).toEqual(child);
    const r2 = project.getRoot();
    expect(r2).toHaveProperty("_children", [child]);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(child);
  });

  it("update root-object", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();
    const fn = jest.fn();
    project.subscribe("update-object", fn);

    const update = { ...root, name: "newName" };
    const result = project.updateObject(update);
    expect(result.name).toEqual("newName");
    expect(result._id).toEqual(root._id);
    const r = project.getRoot();
    expect(r).toHaveProperty("_id", "0:0");
    expect(r).toHaveProperty("name", "newName");

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toBeCalledWith(update);
  });

  it("append children to root", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();

    const c1 = { _id: "1:1", _type: "p1", _parent: `${root._id}-5` };
    const c2 = { _id: "1:2", _type: "p2", _parent: `${root._id}-6` };
    const c3 = { _id: "1:3", _type: "p3", _parent: `${root._id}-7` };
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
    const project = new Project("a", "hallo");
    const root = project.getRoot();

    const c1 = { _id: "1:1", name: "p1", _parent: `${root._id}-4` };
    const c2 = { _id: "1:2", name: "p2", _parent: `${root._id}-3` };
    const c3 = { _id: "1:3", name: "p3", _parent: `${root._id}-4` };
    expect(project.createObject(c1)).toHaveProperty("_parent", `${root._id}-4`);
    expect(project.createObject(c2)).toHaveProperty("_parent", `${root._id}-3`);
    // change fIndex
    expect(project.createObject(c3)).toHaveProperty("_parent", `${root._id}-5`);
    let r = project.getRoot();
    expect(r._children?.map((o) => o.name)).toEqual(["p2", "p1", "p3"]);
  });

  it("update parent", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();

    const page1 = { _id: "1:1", name: "p1", _parent: `${root._id}-5` };
    project.createObject(page1);
    const page2 = { _id: "1:2", name: "p2", _parent: `${root._id}-6` };
    project.createObject(page2);

    let p1 = project.getObject(page1._id);
    expect(p1).toHaveProperty("name", "p1");
    let p2 = project.getObject(page2._id);
    expect(p2).toHaveProperty("name", "p2");

    const element = { _id: "1:3", name: "line", _parent: `${page1._id}-5` };
    project.createObject(element);
    p1 = project.getObject(page1._id);
    expect(p1).toHaveProperty("name", "p1");
    expect(p1).toHaveProperty("_children", [element]);

    const update = { _id: element._id, _parent: `${page2._id}-5` };
    expect(project.updateObject(update)).toHaveProperty("name", "line");
    const e = project.getObject(element._id);

    // removed from p1
    p1 = project.getObject(page1._id);
    expect(p1).toHaveProperty("name", "p1");
    expect(p1).toHaveProperty("_children", []);

    // added to p2
    p2 = project.getObject(page2._id);
    expect(p2).toHaveProperty("name", "p2");
    expect(p2).toHaveProperty("_children", [{ ...element, ...update }]);
  });

  it("delete object", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();
    const fn = jest.fn();
    project.subscribe("delete-object", fn);

    const page1 = { _id: "1:1", name: "p1", _parent: `${root._id}-5` };
    project.createObject(page1);

    project.deleteObject(page1._id);
    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page1._id)).toBeUndefined();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(page1._id);
  });

  it("delete object with childs", () => {
    const project = new Project("a", "hallo");
    const root = project.getRoot();

    const page = { _id: "1:1", name: "page", _parent: `${root._id}-5` };
    project.createObject(page);
    const element = project.createObject({
      _id: "1:2",
      name: "line",
      _parent: `${page._id}-1`,
    });

    project.deleteObject(page._id);

    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page._id)).toBeUndefined();
    expect(project.getObject(element._id)).toBeUndefined();
  });

  // it("change-objects", () => {
  //   const project = new Project("a", "hallo");

  //   const fn = jest.fn();
  //   project.subscribe("change-object", fn);

  //   const pageA = {
  //     _id: "1:0",
  //     name: "pageA",
  //     _parent: `${project.getRoot()._id}-5`,
  //   };
  //   const pageB = {
  //     _id: "1:1",
  //     name: "pageB",
  //     _parent: `${project.getRoot()._id}-5`,
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
