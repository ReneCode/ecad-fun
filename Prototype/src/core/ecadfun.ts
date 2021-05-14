import "./ecadfun.d";
import { NodeType } from "./ecadfun.d";

class EcadfunAPI {
  readonly version = "1.0.0";
  lastIdCounter: number = 0;

  createNode(name: string) {
    return {
      id: "",
      type: "PAGE" as NodeType,
      name: "",
      children: [],
      parent: "",
    };
  }
}

if (!global.ecadfun) {
  console.log("create EcadfunAPI");
  global.ecadfun = new EcadfunAPI();
}
