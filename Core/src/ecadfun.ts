import "./ecadfun.d";

class EcadfunAPI {
  readonly version = "1.0.0";
  lastIdCounter: number = 0;

  createNode(name: string) {}
}

if (!global.ecadfun) {
  console.log("create EcadfunAPI");
  global.ecadfun = new EcadfunAPI();
}
