import {
  EditType,
  IArcNode,
  ILineNode,
  INode,
  IPageNode,
  NodeType,
} from "./ecadfun.d";
import { FractionIndex } from "./FractionIndex";
import { NodeProxy } from "./NodeProxy";

// interface INode {
//   type: NodeType;
//   id: string;
//   name: string;
//   parent: string; //  <parentId>:<fIndex>
// }

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

class ArcNode extends Node implements IArcNode {
  radius: number = 10;
}

class PageNode extends Node implements IPageNode {
  readonly type = "PAGE";
}

class LineNode extends Node implements ILineNode {
  readonly type = "LINE";
}

class Project extends Node {
  readonly type = "PROJECT";
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
    const page = this.createNode(PageNode, "PAGE", name);
    return NodeProxy.create<PageNode>(page, this.addEditData.bind(this));
    return page;
  }

  createLine(name: string) {
    const line = this.createNode(LineNode, "LINE", name);
    return NodeProxy.create<LineNode>(line, this.addEditData.bind(this));
    return line;
  }

  createArc(name: string) {
    const arc = this.createNode(ArcNode, "ARC", name);
    const arcHandler = {
      get: (arc: ArcNode, prop: string | number | symbol, target: any) => {
        return Reflect.get(arc, prop, target);
      },
      set: (target: ArcNode, prop: string | number | symbol, value: any) => {
        if (prop === "id") {
          return false;
        }
        return Reflect.set(target, prop, value);
      },
    };
    return new Proxy(arc, arcHandler);
  }

  export() {
    return this.findAll().map((node: INode) => {
      const n: INode = { ...node };
      // do not export .project and .children properties
      delete (n as any).project;
      delete (n as any).children;
      return n;
    });
  }

  import(nodes: Partial<INode>[]) {
    this.nodes = {};
    this.addNode(this);
    this.children = [];
    for (let node of nodes) {
      const newNode = new Node(this, node.id!, node.type!, node.name!);
      this.addNode(newNode);
      if (node.parent) {
        const [parentId, parentFIndex] = node.parent.split("/");
        const parent = this.getNode(parentId);
        newNode.parent = node.parent;
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

  // https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables
  private createNode<T extends Node>(
    c: new (project: Project, id: string, type: NodeType, name: string) => T,
    type: NodeType,
    name: string
  ): T {
    const node = new c(this, this.newId(), type, name);
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
