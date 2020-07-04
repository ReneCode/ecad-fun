import { wait } from "./utils";
import Project from "./Project";

const projectDb: Record<string, Project> = {};

class ProjectService {
  public async open(projectId: string) {
    let project = await this.get(projectId);
    if (!project) {
      project = await this.create(projectId);
    }
    return project;
  }

  async get(projectId: string) {
    await wait(10);
    return projectDb[projectId];
  }

  private async create(projectId: string) {
    await wait(10);
    const project = new Project(projectId);
    projectDb[projectId] = project;
    return project;
  }
}

const projectService = new ProjectService();

export default projectService;
