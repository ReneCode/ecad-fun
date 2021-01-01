import fs from "fs";
import path from "path";
import { Project } from "./share";
import { wait } from "./utils";
import { Scheduler } from "./Scheduler";

const projectPath: string = path.join(
  __dirname,
  "..",
  process.env.PROJECT_PATH || "./"
);

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
}

export const projectService = new ProjectService();
