import { Project } from "./ObjectStore/Project";
import { wait } from "./utils";

class ProjectService {
  projects: Record<string, Project> = {};

  async open(projectId: string) {
    await wait();
    let project = this.projects[projectId];
    if (!project) {
      project = new Project(projectId, "new project");
    }
    return project;
  }
}

const projectService = new ProjectService();

export default projectService;
