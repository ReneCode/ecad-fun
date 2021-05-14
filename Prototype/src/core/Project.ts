import {
  combineParentProperty,
  insertChildToParent,
  splitParentProperty,
} from "./childrenUtils";
import {
  EditLogType,
  BaseNodeMixin,
  IArcNode,
  ILineNode,
  IPageNode,
  NodeType,
  NodeRecord,
} from "./ecadfun.d";
import { FractionIndex } from "./FractionIndex";
import { NodeProxy } from "./NodeProxy";

class Node implements BaseNodeMixin {
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
  flushEditsCallback: (data: EditLogType[]) => void;
  private editLog: null | EditLogType[] = [];

  constructor(
    clientId: string,
    key: string,
    flushEditsCallback: (data: EditLogType[]) => void
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
    return this.createNode(PageNode, this.newId(), "PAGE", name);
  }

  createLine(name: string) {
    return this.createNode(LineNode, this.newId(), "LINE", name);
  }

  createArc(name: string) {
    const arc = this.createNode(ArcNode, this.newId(), "ARC", name);
    return NodeProxy.create<ArcNode>(arc, this.addEditData.bind(this));
  }

  export() {
    return this.findAll().map((node: Node) => {
      const n = { ...node };
      // do not export .project and .children properties
      delete (n as any).project;
      delete (n as any).children;
      return n;
    });
  }

  import(
    nodes: { id: string; type: string; parent?: string; name?: string }[]
  ) {
    this.nodes = {};
    this.addNode(this);
    this.children = [];
    try {
      // stop logging while importing
      this.editLog = null;

      for (let node of nodes) {
        const newNode = this.buildNewNode(
          node.id,
          node.type as NodeType,
          node.name ? node.name : ""
        );
        if (node.parent) {
          const [parentId, parentFIndex] = splitParentProperty(node.parent);
          const parent = this.getNode(parentId);
          newNode.parent = node.parent;
          parent.children.push(newNode);
        }
      }
    } finally {
      // restart logging
      this.editLog = [];
    }
  }

  applyEdits(edits: EditLogType[]) {
    for (let edit of edits) {
      switch (edit.a) {
        case "c":
          this.applyEditCreate(edit.n);
          break;
        case "u":
          this.applyEditUpdate(edit.n);
          break;
        default:
          throw new Error(`applyEdits: bad action: ${(edit as any).a}`);
      }
    }
  }

  private applyEditCreate(
    edit: { id: string; type: NodeType; name: string } & NodeRecord
  ) {
    const id = edit.id;
    if (!id) {
      throw new Error("can't apply edit without id");
    }
    if (this.nodes[id]) {
      throw new Error(`can't apply edit-create. Id ${id} allready exists`);
    }
    const node = this.buildNewNode(id, edit.type, edit.name as string);
    this.applyProperties(node, edit);
  }

  private applyEditUpdate(edit: { id: string } & NodeRecord) {
    const node = this.getNode(edit.id);
    this.applyProperties(node, edit);
  }

  private applyProperties(node: Node, props: Record<string, unknown>) {
    for (let prop in props) {
      if (prop === "id" || prop === "type") {
        continue;
      }
      if (prop === "parent") {
        let parentValue = props[prop] as string;
        const [parentId, fIndex] = splitParentProperty(parentValue);
        const parent = this.getNode(parentId);
        const newfIndex = insertChildToParent(parent, node, fIndex);
        if (newfIndex !== fIndex) {
          parentValue = combineParentProperty(parentId, newfIndex);
          // modified parent value
          props[prop] = parentValue;
        }
        (node as any)[prop] = parentValue;
      } else {
        (node as any)[prop] = props[prop];
      }
    }
  }

  addEditData(data: EditLogType) {
    if (this.editLog) {
      this.editLog.push(data);
    }
  }

  flushEdits() {
    if (this.editLog && this.editLog.length > 0) {
      this.flushEditsCallback(this.editLog);
    }
    this.editLog = [];
  }

  // https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables
  private createNode<T extends Node>(
    c: new (project: Project, id: string, type: NodeType, name: string) => T,
    id: string,
    type: NodeType,
    name: string
  ): T {
    const node = new c(this, id, type, name);

    this.addEditData({
      a: "c",
      n: { id: node.id, type: type, name: name },
    });
    const proxy = NodeProxy.create<T>(node, this.addEditData.bind(this));
    this.addNode(proxy);
    return proxy;
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

  public getNode(id: string) {
    const node = this.nodes[id];
    if (!node) {
      throw new Error(`Node not found. id:${id}`);
    }
    return node;
  }

  buildNewNode(id: string, type: NodeType, name: string): Node {
    switch (type) {
      case "PAGE":
        return this.createNode(PageNode, id, type, name);
      case "LINE":
        return this.createNode(LineNode, id, type, name);
      default:
        throw new Error(`bad node type: ${type}`);
    }
  }
}

export { Project, PageNode, LineNode, Node };
