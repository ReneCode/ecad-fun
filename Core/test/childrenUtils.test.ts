import { insertChildToParent, setChildToParent } from "../src/childrenUtils";

describe("childrenUtils", () => {
  describe("insertChildToParent", () => {
    it("empty parent", () => {
      const parent = { id: "1:1", children: [] };
      const child = { id: "1:2", parent: "" };
      const fIndex = insertChildToParent(parent, child, "1");
      expect(fIndex).toEqual("1");
      expect(parent.children).toHaveLength(1);
      expect(parent.children[0]).toBe(child);
    });

    it("append", () => {
      const childA = { id: "1:2", parent: "1:1-1", name: "A" };
      const childB = { id: "1:3", parent: "", name: "B" };
      const parent = { id: "1:1", children: [childA] };
      const fIndex = insertChildToParent(parent, childB, "2");
      expect(fIndex).toEqual("2");
      expect(parent.children).toHaveLength(2);
      expect(parent.children[0]).toBe(childA);
      expect(parent.children[1]).toBe(childB);
    });

    it("insert at head", () => {
      const childA = { id: "1:2", parent: "", name: "A" };
      const childB = { id: "1:3", parent: "1:1-2", name: "B" };
      const parent = { id: "1:1", children: [childB] };
      const fIndex = insertChildToParent(parent, childA, "1");
      expect(fIndex).toEqual("1");
      expect(parent.children).toHaveLength(2);
      expect(parent.children[0]).toBe(childA);
      expect(parent.children[1]).toBe(childB);
    });

    it("insert", () => {
      const childA = { id: "1:2", parent: "1:1-1", name: "A" };
      const childB = { id: "1:3", parent: "", name: "B" };
      const childC = { id: "1:4", parent: "1:1-3", name: "C" };
      const parent = { id: "1:1", children: [childA, childC] };
      const fIndex = insertChildToParent(parent, childB, "2");
      expect(fIndex).toEqual("2");
      expect(parent.children).toHaveLength(3);
      expect(parent.children[0]).toBe(childA);
      expect(parent.children[1]).toBe(childB);
      expect(parent.children[2]).toBe(childC);
    });
    it("conflict at last children - append after", () => {
      const childA = { id: "1:2", parent: "1:1-1", name: "A" };
      const childB = { id: "1:3", parent: "", name: "B" };
      const parent = { id: "1:1", children: [childA] };
      const fIndex = insertChildToParent(parent, childB, "1");
      expect(fIndex).toEqual("2");
      expect(parent.children).toHaveLength(2);
      expect(parent.children[0]).toBe(childA);
      expect(parent.children[1]).toBe(childB);
    });

    it("conflict in children", () => {
      const childA = { id: "1:2", parent: "1:1-1", name: "A" };
      const childB = { id: "1:3", parent: "1:1-2", name: "B" };
      const childC = { id: "1:4", parent: "", name: "C" };
      const parent = { id: "1:1", children: [childA, childB] };
      const fIndex = insertChildToParent(parent, childC, "1");
      expect(fIndex).toEqual("1V");
      expect(parent.children).toHaveLength(3);
      expect(parent.children[0]).toBe(childA);
      expect(parent.children[1]).toBe(childC);
      expect(parent.children[2]).toBe(childB);
    });
  });

  describe("setChildToParent", () => {
    it("empty parent", () => {
      const parent = { id: "0:0", children: [] };
      const child = { id: "1:1", parent: "" };
      setChildToParent(parent, child, "5");
      expect(parent.children).toHaveLength(1);
      expect(parent.children[0]).toBe(child);
    });

    it("append, no conflict", () => {
      const parent = { id: "0:0", children: [] };
      const childA = { id: "1:1", parent: "0:0-5" };
      const childB = { id: "1:2", parent: "" };
      insertChildToParent(parent, childA, "5");
      setChildToParent(parent, childB, "6");
      expect(parent.children).toHaveLength(2);
      expect(parent.children[0]).toBe(childA);
      expect(parent.children[0]).toHaveProperty("parent", "0:0-5");
      expect(parent.children[1]).toBe(childB);
      expect(parent.children[1]).toHaveProperty("parent", "");
    });

    it("append, modifiy old parent", () => {
      const parent = { id: "0:0", children: [] };
      const childA = { id: "1:1", parent: "0:0-5" };
      const childB = { id: "1:2", parent: "" };
      insertChildToParent(parent, childA, "5");
      setChildToParent(parent, childB, "5");
      expect(parent.children).toHaveLength(2);
      expect(parent.children[0]).toBe(childB);
      expect(parent.children[0]).toHaveProperty("parent", "");
      expect(parent.children[1]).toBe(childA);
      expect(parent.children[1]).toHaveProperty("parent", "0:0-6");
    });

    it("set add head, modify old parent", () => {
      const parent = { id: "0:0", children: [] };
      const childA = { id: "1:1", parent: "0:0-5" };
      const childB = { id: "1:2", parent: "0:0-6" };
      const childC = { id: "1:3", parent: "" };
      insertChildToParent(parent, childA, "5");
      insertChildToParent(parent, childB, "6");
      setChildToParent(parent, childC, "5");
      expect(parent.children).toHaveLength(3);
      expect(parent.children[0]).toBe(childC);
      expect(parent.children[0]).toHaveProperty("parent", "");
      expect(parent.children[1]).toBe(childA);
      expect(parent.children[1]).toHaveProperty("parent", "0:0-5V");
      expect(parent.children[2]).toBe(childB);
      expect(parent.children[2]).toHaveProperty("parent", "0:0-6");
    });
  });
});
