declare global {
  namespace NodeJS {
    interface Global {
      ecadfun: EcadfunAPI;
    }
  }
}

interface EcadfunAPI {
  readonly version: "1.0.0";

  hello(msg: string): void;
}

export {};
