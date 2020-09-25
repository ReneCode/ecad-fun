import { ObjectType, TYPE_ROOT } from "./types";
import { randomId } from "../utils/randomId";
import { Project } from "./Project";

type ProjectType = ObjectType & {
  name: string;
};

type ResultType = {
  result: "ok" | "error";
  data?: ObjectType;
};

export class ObjectStore {
  projects: Record<string, Project> = {};

  createProject(name: string): ProjectType {
    const idProject = randomId();
    const result = {
      _id: idProject,
      _type: TYPE_ROOT,
      name: name,
    };
    this.projects[idProject] = new Project(idProject, name);
    return result;
  }

  readProject(idProject: string) {
    const project = this.projects[idProject];
    if (project) {
      return { result: "ok", data: project.readProject() };
    }
    return { result: "error" };
  }

  createObject(idProject: string, obj: ObjectType): ResultType {
    try {
      const project = this.projects[idProject];
      if (project) {
        return { result: "ok", data: project.createObject(obj) };
      }
      return { result: "error" };
    } catch (err) {
      // console.error(err);
      return { result: "error" };
    }
  }
}
