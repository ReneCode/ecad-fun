import { wait } from "../utils";
import { randomId } from "../utils/randomId";

type DbProject = {
  name: string;
  userId: string;
  id: string;
};

const projects: DbProject[] = [];

export const dbGetProjects = async (userId: string) => {
  await wait(50);
  return projects.filter((p) => p.userId === userId);
};

export const dbAddProject = async (userId: string, projectName: string) => {
  await wait(50);
  const id = randomId();
  const dbProject = {
    userId,
    name: projectName,
    id,
  };
  projects.push(dbProject);
  return dbProject;
};

export const dbGetProjectById = async (userId: string, projectId: string) => {
  await wait(50);
  return projects.find((p) => p.userId === userId && p.id === projectId);
};
