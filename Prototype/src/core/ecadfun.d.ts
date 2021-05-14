declare global {
  namespace NodeJS {
    interface Global {
      ecadfun: EcadfunAPI;
    }
  }
}

type NodeType = "PROJECT" | "PAGE" | "LINE" | "ARC";

type EditLogType = {
  a: "c" | "u";
  n: Record<string, unknown>;
};

interface BaseNodeMixin {
  id: string;
  type: NodeType;
  name: string;
  children: BaseNodeMixin[];
  parent: string;
}

interface INode extends BaseNodeMixin {}

interface EcadfunAPI {
  readonly version: "1.0.0";

  createNode(name: string): BaseNode;
}

interface IPageNode extends BaseNodeMixin {
  type: string = "PAGE";
}

interface ILineNode extends BaseNodeMixin {
  type: string = "LINE";
}

interface IArcNode extends BaseNodeMixin {
  type: string = "ARC";
  radius: number = 10;
}

export { EditLogType, NodeType, INode, IArcNode, IPageNode, ILineNode };
