import fs from "fs";
import path from "path";
import { Project } from "multiplayer";
import { wait } from "./utils";
import { IntervalCallback } from "./IntervalCallback";

const projectPath: string = path.join(
  __dirname,
  "..",
  process.env.PROJECT_PATH || "./"
);

class ProjectService {
  projects: Map<string, Project> = new Map();
  saveInterval = new IntervalCallback();
  closeInterval = new IntervalCallback();

  public async open(projectId: string) {
    await wait();
    this.closeInterval.init(
      projectId,
      () => this.close(projectId),
      60_000,
      true
    );
    let project = this.projects.get(projectId);
    if (!project) {
      const newProject = new Project(projectId);
      this.load(newProject);
      this.projects.set(projectId, newProject);
      this.saveInterval.init(projectId, () => this.save(newProject), 10_000);
      return newProject;
    } else {
      this.saveInterval.enableCallback(projectId);
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

  private async close(projectId: string) {
    this.projects.delete(projectId);
    console.log(`close project: ${projectId}`);
    await wait();
  }
}

export const projectService = new ProjectService();
