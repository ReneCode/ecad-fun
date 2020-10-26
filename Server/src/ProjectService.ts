import fs from "fs";
import path from "path";
import { Project } from "multiplayer";
import { wait } from "./utils";
import { IntervalCallback } from "./IntervalCallback";

class ProjectService {
  projects: Record<string, Project> = {};
  intervalCallback = new IntervalCallback();

  async open(projectId: string) {
    await wait();
    let project = this.projects[projectId];
    if (!project) {
      project = new Project(projectId);
      this.projects[projectId] = project;
      this.intervalCallback.init(projectId, () => this.save(project), 10_000);
    }

    this.intervalCallback.enableCallback(projectId);
    return project;
  }

  async save(project: Project) {
    console.log("> save Project", project.id);
    const content = project.save();
    const p = path.join("./", `${project.id}.json`);
    fs.writeFileSync(p, JSON.stringify(content, null, 1));
  }

  async close(projectId: string) {
    this.intervalCallback.exit(projectId);
    await wait();
  }
}

export const projectService = new ProjectService();
