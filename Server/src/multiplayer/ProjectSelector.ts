import projectService from "../StoreService";
import ProjectStore from "./ProjectStore";

class ProjectSelector {
  projects: Map<string, ProjectStore> = new Map();

  selectProject(projectId: string) {}
}

const projectSelector = new ProjectSelector();

export default projectService;
