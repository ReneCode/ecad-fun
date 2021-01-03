import path from "path";
import { Project } from "./share";
import { wait } from "./utils";
import { Scheduler } from "./Scheduler";
import { loadJson, saveJson } from "./utils/json";

class ProjectService {
  projects: Map<
    string,
    { project: Project; closeScheduler: Scheduler }
  > = new Map();

  public status() {
    const projects: string[] = [];
    this.projects.forEach((value: any, key: string) => {
      projects.push(key);
    });
    return projects;
  }

  public async create({ name }: { name: string }): Promise<string> {
    await wait();

    return "";
  }

  public async open(projectId: string) {
    await wait();
    const data = this.projects.get(projectId);
    if (!data) {
      const project = new Project(projectId);
      this.load(project);

      let saveScheduler: Scheduler | undefined = undefined;
      const closeScheduler = new Scheduler(() => {
        // time is over, close that project
        console.log(`close project: ${projectId}`);
        this.projects.delete(projectId);
        closeScheduler.exit();
        saveScheduler?.exit();
      }, 60_000);

      saveScheduler = new Scheduler(() => {
        // take a snapshot to save from the project if it's dirty
        const foundProject = this.projects.get(projectId)?.project;
        if (foundProject && foundProject.getAndClearDirty()) {
          this.save(foundProject);
          closeScheduler.reset();
        }
      }, 10_000);
      this.projects.set(projectId, { project, closeScheduler });
      return project;
    } else {
      // additional client wants that project
      // reset the close scheduler
      console.log("project already open:", projectId);
      data.closeScheduler.reset();
      return data.project;
    }
  }

  private load(project: Project) {
    const json = loadJson(`${project.id}.json`);
    if (json) {
      project.load(json);
      return true;
    }
    return false;
  }

  private save(project: Project) {
    const content = project.save();
    saveJson(`${project.id}.json`, content);
  }
}

export const projectService = new ProjectService();
