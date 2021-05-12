import "./ecadfun.d";

class EcadfunAPI {
  readonly version = "1.0.0";

  hello(msg: string) {
    return `Hello: ${msg}`;
  }
}

if (!global.ecadfun) {
  global.ecadfun = new EcadfunAPI();
}
