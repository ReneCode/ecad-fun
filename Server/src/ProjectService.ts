import fs from "fs";
import path from "path";
import { Project } from "./share";
import { wait } from "./utils";
import { IntervalCallback } from "./IntervalCallback";
import { Scheduler } from "./Scheduler";

const projectPath: string = path.join(
  __dirname,
  "..",
  process.env.PROJECT_PATH || "./"
);

class ProjectService {
  projects: Map<string, Project> = new Map();

  public async open(projectId: string) {
    await wait();
    let project = this.projects.get(projectId);
    if (!project) {
      const newProject = new Project(projectId);
      this.load(newProject);
      this.projects.set(projectId, newProject);

      let saveScheduler: Scheduler | undefined = undefined;
      const closeScheduler = new Scheduler(() => {
        this.close(projectId);
        closeScheduler.exit();
        saveScheduler?.exit();
      }, 60_000);

      saveScheduler = new Scheduler(() => {
        if (newProject.getAndClearDirty()) {
          this.save(newProject);
          closeScheduler.reset();
        }
      }, 10_000);
      return newProject;
    } else {
      return project;
    }
  }

  private load(project: Project) {
    try {
      const p = path.join(projectPath, `${project.id}.json`);
      if (!fs.existsSync(p)) {
        console.error(`project path does not exists: ${p}`);
      }
      const content = fs.readFileSync(p, "utf8");
      if (content) {
        const json = JSON.parse(content);
        project.load(json);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private save(project: Project) {
    const content = project.save();
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    const p = path.join(projectPath, `${project.id}.json`);
    console.log(`save project: ${p}`);
    fs.writeFileSync(p, JSON.stringify(content, null, 1));
  }

  private close(projectId: string) {
    this.projects.delete(projectId);
    console.log(`close project: ${projectId}`);
  }
}

export const projectService = new ProjectService();
