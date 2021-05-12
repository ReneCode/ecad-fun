declare global {
  namespace NodeJS {
    interface Global {
      ecadfun: EcadfunAPI;
    }
  }
}

interface BaseNodeMixin {
  id: string;
  name: string;
  children;
}

interface EcadfunAPI {
  readonly version: "1.0.0";

  createNode(name: string): BaseNode;
}

export {};
