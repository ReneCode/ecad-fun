import { FractionIndex } from "./FractionIndex";

class Node {
  id: string;
  name: string;
  children: Node[] = [];
  parent: string = ""; //  <parentId>:<fIndex>

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class Project extends Node {
  key: string;
  clientId: string;
  lastIdCounter: number = 0;
  nodes: Record<string, Node> = {};

  constructor(clientId: string, key: string) {
    super("0:0", "root");
    this.addNode(this);
    this.clientId = clientId;
    this.key = key;
  }

  createNode(parentId: string, name: string) {
    const parent = this.getNode(parentId);
    const node = new Node(this.newId(), name);
    this.appendChild(parent, node);
    return node;
  }

  private newId() {
    this.lastIdCounter++;
    return `${this.clientId}:${this.lastIdCounter}`;
  }

  private appendChild(parent: Node, node: Node) {
    let fIdx = "";
    const countChildren = parent.children.length;
    const parentId = parent.id;
    if (countChildren === 0) {
      fIdx = FractionIndex.start();
    } else {
      const lastChild = parent.children[countChildren - 1];
      const [pId, parentFIndex] = lastChild.parent.split("/");
      if (pId !== parentId) {
        throw new Error("children panik. ${parentId}, ${pId}");
      }
      fIdx = FractionIndex.after(parentFIndex);
    }
    node.parent = `${parentId}/${fIdx}`;
    parent.children.push(node);
    this.addNode(node);
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
