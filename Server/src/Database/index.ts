import { wait } from "../utils";
import { randomId } from "../utils/randomId";
import { loadJson, saveJson } from "../utils/json";
const path = require("path");

type DbProject = {
  name: string;
  userId: string;
  id: string;
};

export const dbGetProjects = async (userId: string) => {
  await wait(50);
  const projects = loadProjects();
  return projects
    .filter((p) => p.userId === userId)
    .map((p) => ({ name: p.name, id: p.id }));
};

export const dbAddProject = async (userId: string, projectName: string) => {
  await wait(50);
  const projects = loadProjects();
  const id = randomId();
  const dbProject = {
    userId,
    name: projectName,
    id,
  };
  projects.push(dbProject);
  saveProjects(projects);
  return dbProject;
};

export const dbUpdateProject = async (
  userId: string,
  projectId: string,
  { name }: { name: string }
) => {
  await wait(50);
  const projects = loadProjects();
  let updateProject: DbProject | undefined;
  const newProjects = projects.map((p) => {
    if (p.userId === userId && p.id === projectId) {
      updateProject = { ...p, name: name };
      return updateProject;
    } else {
      return p;
    }
  });
  saveProjects(newProjects);
  return updateProject;
};

export const dbDeleteProject = async (userId: string, projectId: string) => {
  await wait(50);
  const projects = loadProjects();
  const newProjects = projects.filter(
    (p) => p.userId !== userId || p.id !== projectId
  );
  saveProjects(newProjects);
};

export const dbGetProjectById = async (userId: string, projectId: string) => {
  await wait(50);
  const projects = loadProjects();
  const project = projects.find(
    (p) => p.userId === userId && p.id === projectId
  );

  if (project) {
    return { name: project.name, id: project.id };
  }
  return undefined;
};

// ----------------------------------------------------------

const saveProjects = (projects: DbProject[]) => {
  saveJson("db-projects.json", projects);
};

const loadProjects = (): DbProject[] => {
  const projects = loadJson("db-projects.json");
  if (!projects) {
    return [];
  }
  return projects;
};
