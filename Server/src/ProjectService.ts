import { Project } from "multiplayer";
import { wait } from "./utils";

class ProjectService {
  projects: Record<string, Project> = {};

  async open(projectId: string) {
    await wait();
    let project = this.projects[projectId];
    if (!project) {
      project = new Project(projectId);
      this.projects[projectId] = project;
    }
    return project;
  }

  async close(projectId: string) {
    await wait();
  }
}

export const projectService = new ProjectService();
