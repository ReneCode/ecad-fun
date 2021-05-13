declare global {
  namespace NodeJS {
    interface Global {
      ecadfun: EcadfunAPI;
    }
  }
}

type NodeType = "PROJECT" | "PAGE" | "LINE" | "ARC";

interface BaseNodeMixin {
  id: string;
  type: NodeType;
  name: string;
  children;
}

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

export { NodeType, IArcNode, IPageNode, ILineNode };
