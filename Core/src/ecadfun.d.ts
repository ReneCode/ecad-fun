declare global {
  namespace NodeJS {
    interface Global {
      ecadfun: EcadfunAPI;
    }
  }
}

type NodeType = "PROJECT" | "PAGE" | "LINE" | "ARC";

type NodeRecord = Record<string, unknown>;

type EditLogType =
  | {
      a: "c";
      n: { id: string; type: NodeType; name: string } & NodeRecord;
    }
  | {
      a: "u";
      n: { id: string } & NodeRecord;
    };

interface BaseNodeMixin {
  id: string;
  type: NodeType;
  name: string;
  children: BaseNodeMixin[];
  parent: string;
}

interface EcadfunAPI {
  readonly version: "1.0.0";

  createNode(name: string): BaseNodeMixin;
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

export {
  EditLogType,
  NodeType,
  NodeRecord,
  BaseNodeMixin,
  IArcNode,
  IPageNode,
  ILineNode,
};
