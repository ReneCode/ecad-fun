import { wait } from "./utils";
import Store from "./Store";

const projectDb: Record<string, Store> = {};

class StoreService {
  public getAll() {}

  public async open(projectId: string) {
    let project = await this.get(projectId);
    if (!project) {
      project = Store.load(projectId);
    }
    return project;
  }

  // public async create(name: string) {
  //   await wait(30);
  //   const project = new Store(name);
  // }

  // -------------------------------------

  private async get(projectId: string) {
    await wait(10);
    return projectDb[projectId];
  }

  private async create(projectId: string) {
    await wait(10);
    const project = new Store(projectId);
    projectDb[projectId] = project;
    return project;
  }
}

const projectService = new StoreService();

export default projectService;
