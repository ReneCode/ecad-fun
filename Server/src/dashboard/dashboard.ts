import { clientService } from "../ObjectStore/ClientService";
import { projectService } from "../ProjectService";

export const drawDashboard = () => {
  console.clear();
  console.log("Projects:");
  console.log("----------------------");
  const projects = projectService.status();
  projects.forEach((projectId) => {
    const data = clientService.getDataByProjectId(projectId);
    const socketIdAndClientIds = data.map(
      (d) => `${d.socketId}(${d.clientId})`
    );
    console.log(`${projectId} | ${socketIdAndClientIds}`);
  });
  console.log("----------------------");
};
