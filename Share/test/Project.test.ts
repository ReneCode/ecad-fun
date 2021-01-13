import { Project } from "../src/Project";
import { ObjectType } from "../src/types";

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
    const [o] = project.createObjects([{ id: "0:1", name: "hello" }]);
    expect(o).toEqual({ id: "0:1", name: "hello" });
  });

  it("createObject, project-clientId 0 - different clientId is ok", () => {
    const project = new Project("a");
    project.setClientId(0);
    expect(project.createObjects([{ id: "2:0", name: "hello" }])).toEqual([
      {
        id: "2:0",
        name: "hello",
      },
    ]);
  });

  // it("createObject, project-clientId > 0 - different clientId throws error", () => {
  //   const project = new Project("a");
  //   project.setClientId(1);
  //   expect(() => project.createObject({ id: "2:0", name: "hello" })).toThrow();
  // });

  it("createObject - throw on bad id", () => {
    const project = new Project("a");
    expect(() => project.createObjects([{ id: "", name: "hello" }])).toThrow();
  });

  it("append to root", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const fn = jest.fn();
    project.subscribe("create-object", fn);

    const child = { id: "0:1", _type: "page", _parent: `${root.id}-5` };
    const [c] = project.createObjects([child]);
    expect(c).toEqual(child);
    const r2 = project.getRoot();
    expect(r2).toHaveProperty("_children", [child]);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toHaveBeenCalledWith([child]);
  });

  it("append without fIndex", () => {
    const project = new Project("a");

    const page1 = { id: project.createNewId(), _parent: "0:0", name: "p1" };
    const page2 = { id: project.createNewId(), _parent: "0:0", name: "p2" };
    const page3 = { id: project.createNewId(), _parent: "0:0", name: "p3" };
    project.createObjects([page1, page2, page3]);

    const root = project.getRoot();
    expect(root._children).toHaveLength(3);
    if (root._children) {
      expect(root._children[0]._parent).toEqual("0:0-1");
      expect(root._children[1]._parent).toEqual("0:0-2");
      expect(root._children[2]._parent).toEqual("0:0-3");
    }
  });

  it("append without fIndex and parent._children is []", () => {
    const project = new Project("a");
    const [page1] = project.createObjects([
      { id: project.createNewId(), _parent: "0:0", name: "p1" },
    ]);
    expect(project.getRoot()._children).toHaveLength(1);
    project.deleteObjects([page1.id]);
    expect(project.getRoot()._children).toHaveLength(0);

    const root = project.getRoot();
    expect(root._children).toEqual([]);

    const page2 = { id: project.createNewId(), _parent: "0:0", name: "p2" };
    project.createObjects([page2]);

    const r = project.getRoot();
    expect(r._children).toHaveLength(1);
    if (root._children) {
      expect(root._children[0]._parent).toEqual("0:0-1");
    }
  });

  it("update root-object", () => {
    const project = new Project("a");
    const root = project.getRoot();
    const fn = jest.fn();
    project.subscribe("update-object", fn);

    const update = { id: root.id, name: "newName" };
    const results = project.updateObjects([update]);
    expect(results).toHaveLength(1);
    expect(results[0].name).toEqual("newName");
    expect(results[0].id).toEqual(root.id);
    const r = project.getRoot();
    expect(r).toHaveProperty("id", "0:0");
    expect(r).toHaveProperty("name", "newName");

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toBeCalledWith([update]);
  });

  it("append children to root", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const c1 = { id: "0:1", _type: "p1", _parent: `${root.id}-5` };
    const c2 = { id: "0:2", _type: "p2", _parent: `${root.id}-6` };
    const c3 = { id: "0:3", _type: "p3", _parent: `${root.id}-7` };
    project.createObjects([c3]);
    let r = project.getRoot();
    expect(r).toHaveProperty("_children", [c3]);

    project.createObjects([c1]);
    r = project.getRoot();
    expect(r).toHaveProperty("_children", [c1, c3]);

    project.createObjects([c2]);
    r = project.getRoot();
    expect(r).toHaveProperty("_children", [c1, c2, c3]);
  });

  it("append children with same fIndex to root", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const c1 = { id: "0:1", name: "p1", _parent: `${root.id}-4` };
    const c2 = { id: "0:2", name: "p2", _parent: `${root.id}-3` };
    const c3 = { id: "0:3", name: "p3", _parent: `${root.id}-4` };
    const result = project.createObjects([c1, c2, c3]);
    expect(result[0]).toHaveProperty("_parent", `${root.id}-4`);
    expect(result[1]).toHaveProperty("_parent", `${root.id}-3`);
    // change fIndex
    expect(result[2]).toHaveProperty("_parent", `${root.id}-5`);
    let r = project.getRoot();
    expect(r._children?.map((o) => o.name)).toEqual(["p2", "p1", "p3"]);
  });

  it("update object - return only changes", () => {
    const project = new Project("a");

    const id = project.createNewId();
    const p1 = { id, name: "p1", type: "page" };
    project.createObjects([p1]);
    const [changes] = project.updateObjects([{ id, name: "p2" }]);
    // only changes
    expect(changes).toEqual({ id, name: "p2" });
    // complete object
    expect(project.getObject(id)).toEqual({
      id,
      type: "page",
      name: "p2",
    });
  });

  it("update object - will change the current object", () => {
    const project = new Project("A");
    const id = project.createNewId();
    const p1New = { id, name: "p1", type: "page" };
    project.createObjects([p1New]);
    const p1 = project.getObject(id);
    expect(p1).toEqual({ id, name: "p1", type: "page" });
    const [_] = project.updateObjects([{ id, name: "p2" }]);
    const p1Update = project.getObject(id);
    expect(p1).toBe(p1Update);
    expect(p1Update).toEqual({ id, name: "p2", type: "page" });
    expect(p1).toEqual({ id, name: "p2", type: "page" });
  });

  it("update parent", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const page1 = { id: "0:1", name: "p1", _parent: `${root.id}-5` };
    const page2 = { id: "0:2", name: "p2", _parent: `${root.id}-6` };
    project.createObjects([page1, page2]);

    let p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    let p2 = project.getObject(page2.id);
    expect(p2).toHaveProperty("name", "p2");

    const element = { id: "0:3", name: "line", _parent: `${page1.id}-5` };
    project.createObjects([element]);
    p1 = project.getObject(page1.id);
    expect(p1).toHaveProperty("name", "p1");
    expect(p1).toHaveProperty("_children", [element]);

    const update = { id: element.id, _parent: `${page2.id}-5` };
    expect(project.updateObjects([update])).toEqual([
      {
        id: element.id,
        _parent: `${page2.id}-5`,
      },
    ]);
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

  it("multiple updates", () => {
    const project = new Project("multiple");
    project.createObjects([
      { id: "1:0", name: "p1" },
      { id: "1:1", name: "p2" },
    ]);
    const update = project.updateObjects([
      { id: "1:0", type: "page" },
      { id: "1:1", name: "p2b" },
    ]);
    expect(update).toEqual([
      { id: "1:0", type: "page" },
      { id: "1:1", name: "p2b" },
    ]);
    expect(project.getObject("1:0")).toEqual({
      id: "1:0",
      name: "p1",
      type: "page",
    });
    expect(project.getObject("1:1")).toEqual({ id: "1:1", name: "p2b" });
  });

  it("delete object", () => {
    const project = new Project("a");
    const root = project.getRoot();
    const fn = jest.fn();
    project.subscribe("delete-object", fn);

    const page1 = { id: "0:1", name: "p1", _parent: `${root.id}-5` };
    project.createObjects([page1]);

    project.deleteObjects([page1.id]);
    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page1.id)).toBeUndefined();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith([page1.id]);
  });

  it("delete object with childs", () => {
    const project = new Project("a");
    const root = project.getRoot();

    const page = { id: "0:1", name: "page", _parent: `${root.id}-5` };
    project.createObjects([page]);
    const elements = project.createObjects([
      {
        id: "0:2",
        name: "line",
        _parent: `${page.id}-1`,
      },
    ]);

    project.deleteObjects([page.id]);

    const r = project.getRoot();
    expect(r).toHaveProperty("_children", []);
    expect(project.getObject(page.id)).toBeUndefined();
    expect(project.getObject(elements[0].id)).toBeUndefined();
  });

  it("multiple deleteObject", () => {
    const project = new Project("multiple");
    project.createObjects([
      { id: "1:0", name: "p1" },
      { id: "1:1", name: "p2" },
    ]);
    const update = project.deleteObjects(["1:0", "1:1"]);
    expect(update).toEqual(["1:0", "1:1"]);
    expect(project.getObject("1:0")).toBeUndefined();
    expect(project.getObject("1:1")).toBeUndefined();
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

    project.createObjects([
      { id: "0:2", name: "page", _parent: `${root.id}-5` },
    ]);

    const id = project.createNewId();
    expect(id).toEqual("0:3");
  });

  it("setRoot", () => {
    const pA = new Project("a");
    let rA = pA.getRoot();
    const rootIdA = rA.id;
    const [page1] = pA.createObjects([
      {
        id: "0:2",
        name: "page",
        _parent: `${rootIdA}-5`,
      },
    ]);
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
    const o = project.createObjects([{ id: "3:7", name: "test" }]);

    const id = project.createNewId();
    expect(id).toEqual("3:8");
  });

  // it("setClientId + createObject with bad clienId", () => {
  //   const project = new Project("ABC");
  //   project.setClientId(3);
  //   expect(() => project.createObject({ id: "5:0", name: "test" })).toThrow();
  // });

  it("createObjects will increment id-counter", () => {
    const project = new Project("ABC");
    project.setClientId(1);
    project.createObjects([
      { id: "1:5", name: "p1" },
      { id: "1:10", name: "p2" },
      { id: "1:20", name: "p3" },
    ]);

    const id = project.createNewId();
    expect(id).toEqual("1:21");
  });

  it("createObject with mutiple objectTypes", () => {
    const project = new Project("multiple");

    const newObjects = project.createObjects([
      {
        id: "1:1",
        name: "o1",
        type: "page",
      },
      {
        id: "1:2",
        name: "o2",
        type: "page",
      },
    ]);
    expect(newObjects).toEqual([
      {
        id: "1:1",
        name: "o1",
        type: "page",
      },
      {
        id: "1:2",
        name: "o2",
        type: "page",
      },
    ]);
  });

  describe("dirty", () => {
    it("create", () => {
      const project = new Project("D");
      expect(project.getAndClearDirty()).toBe(false);
      project.createObjects([{ id: "1:0", type: "page", name: "p1" }]);
      expect(project.getAndClearDirty()).toBe(true);
      expect(project.getAndClearDirty()).toBe(false);
    });

    it("update", () => {
      const project = new Project("D");
      project.createObjects([{ id: "1:0", type: "page", name: "p1" }]);
      project.getAndClearDirty();
      project.updateObjects([{ id: "1:0", name: "p2" }]);
      expect(project.getAndClearDirty()).toBe(true);
      expect(project.getAndClearDirty()).toBe(false);
    });

    it("delete", () => {
      const project = new Project("D");
      project.createObjects([{ id: "1:0", type: "page", name: "p1" }]);
      project.getAndClearDirty();
      project.deleteObjects(["1:0"]);
      expect(project.getAndClearDirty()).toBe(true);
      expect(project.getAndClearDirty()).toBe(false);
    });
  });

  describe("save/load", () => {
    it("basic", () => {
      const projectA = new Project("A");
      projectA.createObjects([
        { id: "1:0", type: "pageA" },
        { id: "1:1", type: "pageB" },
      ]);
      const rootA = projectA.getRoot();
      const content = projectA.save();
      expect(content).toHaveLength(3);

      const projectB = new Project("B");
      projectB.load(content);

      const rootB = projectB.getRoot();
      expect(rootA).toEqual(rootB);
    });

    it("update lastId after load", () => {
      const project = new Project("A");
      project.setClientId(1);
      const content = [
        { id: "0:0", projectId: "A", _type: "project" },
        { id: "1:0", type: "pageA", _parent: "0:0-5" },
        { id: "1:1", type: "pageB", _parent: "0:0-6" },
      ];
      project.load(content);
      const id = project.createNewId();
      expect(id).toBe("1:2");
    });

    it("with hierarchie", () => {
      const projectA = new Project("A");

      projectA.createObjects([
        { id: "1:0", type: "pageA", _parent: "0:0-5" },
        { id: "1:1", type: "pageB", _parent: "0:0-4" },
        { id: "1:2", type: "element", _parent: "1:0-5" },
      ]);
      const rootA = projectA.getRoot();
      const content = projectA.save();
      expect(content).toHaveLength(4);

      const projectB = new Project("B");
      projectB.load(content);
      const rootB = projectB.getRoot();
      expect(rootA).toEqual(rootB);
    });

    it("without _children property", () => {
      const projectA = new Project("A");

      projectA.createObjects([
        { id: "1:0", type: "pageA", _parent: "0:0-5" },
        { id: "1:1", type: "pageB", _parent: "0:0-4" },
        { id: "1:2", type: "element", _parent: "1:0-5" },
      ]);
      const rootA = projectA.getRoot();
      const content = projectA.save();
      for (let o of content) {
        expect(o._children).toBeUndefined();
      }
    });

    describe("performance", () => {
      let project: Project;
      const COUNT = 1_000;
      let content: readonly ObjectType[] = [];

      it("createObject-single", () => {
        project = new Project("A");
        for (let i = 0; i < COUNT; i++) {
          project.createObjects([
            { id: project.createNewId(), name: `name-${i}`, _parent: "0:0-5" },
          ]);
        }
      });
      it("createObject-multiple", () => {
        project = new Project("B");
        const objects = [];
        for (let i = 0; i < COUNT; i++) {
          objects.push({
            id: project.createNewId(),
            name: `name-${i}`,
            _parent: "0:0-5",
          });
        }
        project.createObjects(objects);
      });

      it("save manny", () => {
        content = project.save();
        expect(content).toHaveLength(COUNT + 1);
      });

      it("load many", () => {
        const projectB = new Project("B");
        projectB.load(content);
      });
    });
  });

  describe("query", () => {
    it("get one obj", () => {
      const project = new Project("A");

      project.createObjects([
        { id: "1:0", name: "p1", _parent: "0:0" },
        { id: "1:1", name: "p2", _parent: "0:0" },
      ]);

      const [result] = project.query({ q: [{ prop: "name", value: "p2" }] });
      expect(result.id).toBe("1:1");
      expect(result.name).toBe("p2");
    });

    it("get multiple objects by type", () => {
      const project = new Project("A");

      project.createObjects([
        { id: "1:0", type: "page", name: "p1", _parent: "0:0" },
        { id: "1:1", type: "page", name: "p2", _parent: "0:0" },
        { id: "1:2", type: "layer", name: "l1", _parent: "0:0" },
      ]);

      const result = project.query({ q: [{ prop: "type", value: "page" }] });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1:0");
      expect(result[1].id).toBe("1:1");
    });

    it("get none in the 2.level without depth parameter", () => {
      const project = new Project("A");

      project.createObjects([
        { id: "1:0", type: "page", name: "p1", _parent: "0:0" },
        { id: "1:1", type: "page", name: "p2", _parent: "0:0" },
        { id: "2:0", name: "e1", _parent: "1:0-5" },
      ]);

      const result = project.query({ q: [{ prop: "name", value: "e1" }] });
      expect(result).toHaveLength(0);
    });

    it("get one in the 2.level, because depth=2", () => {
      const project = new Project("A");

      project.createObjects([
        { id: "1:0", type: "page", name: "p1", _parent: "0:0" },
        { id: "1:1", type: "page", name: "p2", _parent: "0:0" },
        { id: "2:0", name: "e1", _parent: "1:0-5" },
      ]);

      const result = project.query({
        depth: 2,
        q: [{ prop: "name", value: "e1" }],
      });
      expect(result).toHaveLength(1);
    });

    it("get one to a given root", () => {
      const project = new Project("A");

      project.createObjects([
        { id: "1:0", type: "page", name: "p1", _parent: "0:0" },
        { id: "1:1", type: "page", name: "p2", _parent: "0:0" },
        { id: "2:0", name: "e1", _parent: "1:1" },
        { id: "2:1", name: "e2", _parent: "1:1" },
      ]);

      const result = project.query({
        rootId: "1:1",
        q: [{ prop: "name", value: "e2" }],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2:1");
    });
  });

  describe("undo redo", () => {
    it("exception, in default-project", () => {
      const project = new Project("A");
      expect(() => project.undo()).toThrow();
    });
    it("exception, in default-project", () => {
      const project = new Project("A");
      expect(() => project.redo()).toThrow();
    });

    it("undo create simple object", () => {
      const project = new Project("A", { undoRedo: true });
      const id = project.createNewId();
      project.createObjects([{ id, name: "p1", type: "page" }]);
      const p1 = project.getObject(id);
      expect(p1).toEqual({ id, name: "p1", type: "page" });
      project.undo();
      const p1Deleted = project.getObject(id);
      expect(p1Deleted).toEqual(undefined);
    });
  });
});
