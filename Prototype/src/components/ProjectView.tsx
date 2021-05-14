import { useEffect, useState } from "react";
import { EditLogType } from "../core/ecadfun.d";
import { Project } from "../core/Project";

import "./ProjectView.css";

type Props = {
  clientId: string;
};
const ProjectView = ({ clientId }: Props) => {
  const [project, setProject] = useState<Project>(
    undefined as unknown as Project
  );
  const [drawIndex, setDrawIndex] = useState(0);
  const flushEdits = (data: EditLogType[]) => {
    setDrawIndex((i) => i + 1);
  };

  useEffect(() => {
    console.log("create project");
    const project = new Project(clientId, "key", flushEdits);
    setProject(project);
  }, []);

  const onInc = () => {
    setDrawIndex((i) => i + 1);
  };

  const onCreate = () => {
    console.log("create");
    const pages = project.findAll((n) => n.type === "PAGE");
    const page = project.createPage(`page-${pages.length + 1}`);
    project.appendChild(page);
    project.flushEdits();
  };

  if (!project) {
    return null;
  }

  const pages = project.findAll((n) => n.type === "PAGE");
  return (
    <div className="project-view">
      <h3>client: {clientId}</h3>
      <button onClick={onCreate}>Create</button>
      <button onClick={onInc}>Inc</button>
      {pages.map((p) => {
        return <div className="page-node">{p.name}</div>;
      })}
    </div>
  );
};

export default ProjectView;
