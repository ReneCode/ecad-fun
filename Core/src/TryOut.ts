import { FractionIndex } from "./FractionIndex";
import {} from "./ecadfun.d";
import "./ecadfun";

// https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

// https://www.typescriptlang.org/docs/handbook/mixins.html

type FlushType = {
  a: "c";
  n: Record<string, unknown>;
};

type Constructor<T = {}> = new (...args: any[]) => T;

class BaseNode {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const ChildrenMixin = <T extends Constructor>(superclass: T) =>
  class extends superclass {
    children: any[] = [];

    constructor(...args: any[]) {
      super(...args);
    }
    appendChild(node: BaseNode) {
      this.children.push(node);
    }
  };

class ProjectNode extends ChildrenMixin(BaseNode) {}

class PageNode extends ChildrenMixin(BaseNode) {
  constructor(id: string, name: string) {
    super(id, name);
  }
}

class LineNode extends BaseNode {}

const p = new PageNode("a", "name");
const l = new LineNode("a", "name");
p.appendChild(l);
