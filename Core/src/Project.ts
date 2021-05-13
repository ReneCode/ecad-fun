import { FractionIndex } from "./FractionIndex";

type NodeType = "PROJECT" | "PAGE" | "LINE";

type EditType = {
  a: "c" | "u";
  n: Record<string, unknown>;
};

interface INode {
  type: NodeType;
  id: string;
  name: string;
  parent: string; //  <parentId>:<fIndex>
}

class Node implements INode {
  project: Project;
  type: NodeType;
  id: string;
  name: string;
  children: Node[] = [];
  parent: string = "";

  constructor(project: Project, id: string, type: NodeType, name: string) {
    this.project = project;
    this.id = id;
    this.type = type;
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
    this.project.addEditData({
      a: "u",
      n: { id: child.id, parent: child.parent },
    });
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
    this.project.addEditData({
      a: "u",
      n: { id: child.id, parent: child.parent },
    });
  }

  findAll(callback?: (node: Node) => boolean) {
    let result: Node[] = [];
    for (let child of this.children) {
      if (!callback || callback(child)) {
        result.push(child);
      }
      const r = child.findAll(callback);
      result = result.concat(r);
    }
    return result;
  }
}

class Project extends Node {
  key: string;
  clientId: string;
  lastIdCounter: number = 0;
  nodes: Record<string, Node> = {};
  flushEditsCallback: (data: EditType[]) => {};
  private editData: EditType[] = [];

  constructor(
    clientId: string,
    key: string,
    flushEditsCallback: (data: EditType[]) => {}
  ) {
    super(undefined as unknown as Project, "0:0", "PROJECT", "root");
    // this can't use this on super()
    this.project = this;
    this.addNode(this);
    this.clientId = clientId;
    this.key = key;
    this.flushEditsCallback = flushEditsCallback;
  }

  createPage(name: string) {
    const page = this.createNode("PAGE", name);
    return page;
  }

  createLine(name: string) {
    const line = this.createNode("LINE", name);
    return line;
  }

  export() {
    return this.findAll().map((node: Node) => {
      const n: Partial<Node> = { ...node };
      // do not export .project and .children properties
      delete n.project;
      delete n.children;
      return n;
    });
  }

  import(nodes: INode[]) {
    this.nodes = {};
    this.addNode(this);
    this.children = [];
    for (let node of nodes) {
      const newNode = new Node(this, node.id, node.type, node.name);
      this.addNode(newNode);
      if (node.parent) {
        newNode.parent = node.parent;
        const [parentId, parentFIndex] = node.parent.split("/");
        const parent = this.getNode(parentId);
        parent.children.push(newNode);
      }
    }
  }

  applyEditData(data: EditType[]) {}

  addEditData(data: EditType) {
    this.editData.push(data);
  }

  flushEdits() {
    this.flushEditsCallback(this.editData);
    this.editData = [];
  }

  private createNode(type: NodeType, name: string) {
    const node = new Node(this, this.newId(), type, name);
    this.addEditData({
      a: "c",
      n: { id: node.id, type: type, name: name },
    });
    return node;
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

export { Project, Node, INode };
