import { FractionIndex } from "./FractionIndex";

type FlushType = {
  a: "c";
  n: Record<string, unknown>;
};

class Node {
  id: string;
  name: string;
  children: Node[] = [];
  parent: string = ""; //  <parentId>:<fIndex>

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  appendChild(child: Node) {
    let fIdx = "";
    const countChildren = this.children.length;
    const parentId = this.id;
    if (countChildren === 0) {
      fIdx = FractionIndex.start();
    } else {
      const lastChild = this.children[countChildren - 1];
      const [pId, parentFIndex] = lastChild.parent.split("/");
      if (pId !== parentId) {
        throw new Error("children panik. ${parentId}, ${pId}");
      }
      fIdx = FractionIndex.after(parentFIndex);
    }
    child.parent = `${parentId}/${fIdx}`;
    this.children.push(child);
  }

  insertChild(index: number, child: Node) {
    const countChildren = this.children.length;
    if (index < 0) {
      throw new Error(`index too low: ${index}`);
    }
    if (index > countChildren - 1) {
      throw new Error(`index too high: ${index}`);
    }
    let fIdx = "";
    if (index === 0) {
      // first position
      const [_p, idx] = this.children[0].parent.split("/");
      fIdx = FractionIndex.before(idx);
    } else {
      const [_p1, beforeIdx] = this.children[index - 1].parent.split("/");
      const [_p2, afterIdx] = this.children[index].parent.split("/");
      fIdx = FractionIndex.between(beforeIdx, afterIdx);
    }
    const parentId = this.id;
    child.parent = `${parentId}/${fIdx}`;
    this.children.splice(index, 0, child);
  }
}

class Project extends Node {
  key: string;
  clientId: string;
  lastIdCounter: number = 0;
  nodes: Record<string, Node> = {};
  flushCallback: (data: FlushType[]) => {};
  flushData: FlushType[] = [];

  constructor(
    clientId: string,
    key: string,
    flushCallback: (data: FlushType[]) => {}
  ) {
    super("0:0", "root");
    this.addNode(this);
    this.clientId = clientId;
    this.key = key;
    this.flushCallback = flushCallback;
  }

  createNode(name: string) {
    const node = new Node(this.newId(), name);
    this.flushData.push({
      a: "c",
      n: { id: node.id, name: node.name },
    });
    return node;
  }

  flush() {
    this.flushCallback(this.flushData);
    this.flushData = [];
  }

  private newId() {
    this.lastIdCounter++;
    return `${this.clientId}:${this.lastIdCounter}`;
  }

  private addNode(node: Node) {
    const id = node.id;
    if (this.nodes[id]) {
      throw new Error(`Node allready exists. id:${id}`);
    }
    this.nodes[id] = node;
  }

  private getNode(id: string) {
    const node = this.nodes[id];
    if (!node) {
      throw new Error(`Node not found. id:${id}`);
    }
    return node;
  }
}

export { Project };
