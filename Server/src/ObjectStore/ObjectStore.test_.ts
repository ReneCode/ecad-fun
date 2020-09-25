import { resetRandomId } from "../utils/randomId";
import { ObjectStore } from "./objectStore";

describe("ObjectStore", () => {
  let objectStore: ObjectStore;
  beforeEach(() => {
    objectStore = new ObjectStore();
    resetRandomId();
  });
  it("createProject - ok", () => {
    const project = objectStore.createProject("new");
    expect(project).toEqual({ _id: "id1", _type: "root", name: "new" });
  });

  it("readProject project only - ok", () => {
    const project = objectStore.createProject("new");
    const json = objectStore.readProject(project._id);
    expect(json).toEqual({
      result: "ok",
      data: {
        ...project,
        _objects: {
          id1: project,
        },
      },
    });
  });

  it("createObject - ok", () => {
    const project = objectStore.createProject("new");
    const data = {
      _id: "abc",
      _type: "page",
      name: "p1",
    };
    const obj = objectStore.createObject(project._id, data);
    expect(obj).toEqual({
      result: "ok",
      data: data,
    });
  });

  it("createObject - bad idProject", () => {
    const project = objectStore.createProject("new");
    const data = {
      _id: "abc",
      _type: "page",
      name: "p1",
    };
    const obj = objectStore.createObject("badIdProject", data);
    expect(obj).toEqual({
      result: "error",
    });
  });

  it("createObject - duplicate id", () => {
    const project = objectStore.createProject("new");
    const data = {
      _id: "abc",
      _type: "page",
      name: "p1",
    };
    const o1 = objectStore.createObject(project._id, {
      _id: "a",
      _type: "page",
    });
    const o2 = objectStore.createObject(project._id, {
      _id: "a",
      _type: "element",
    });
    expect(o2).toEqual({ result: "error" });
  });

  it("readProject project with objects - ok", () => {
    const project = objectStore.createProject("new");
    const objA = {
      _id: "a",
      _type: "page",
      name: "pa",
    };
    const objB = {
      _id: "b",
      _type: "page",
      name: "pb",
    };
    const oA = objectStore.createObject(project._id, objA);
    const oB = objectStore.createObject(project._id, objB);

    const json = objectStore.readProject(project._id);
    expect(json).toEqual({
      result: "ok",
      data: {
        _type: "root",
        _id: "id1",
        name: "new",
        _objects: {
          id1: project,
          a: objA,
          b: objB,
        },
      },
    });
  });

  xit("getParentAppend", () => {
    const project = objectStore.createProject("new");
    // // appendObject(project, )
    // // const parentProp = project.getParentAppend(project._id);
    // expect(parentProp).toEqual(`${project._id}-${1}`);
  });

  xit("createObject with _parent - ok", () => {
    const project = objectStore.createProject("new");
    // const parentProp = objectStore.getParentAppend(project._id)
    const objA = {
      _id: "a",
      _type: "page",
      _parent: `${project._id}/${5}`,
      name: "pa",
    };
    const oA = objectStore.createObject(project._id, objA);

    const json = objectStore.readProject(project._id);
    expect(json).toEqual({
      result: "ok",
      data: {
        _type: "root",
        _id: "id1",
        name: "new",
        _objects: {
          id1: project,

          a: objA,
        },
        _pageList: [objA._id],
      },
    });
  });
});
