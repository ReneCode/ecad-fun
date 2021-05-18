import { useEffect, useRef, useState } from "react";

import { Project } from "../core/Project";

import "./Editor.scss";
import { ActionManager } from "../actions/actionManager";
import Canvas from "./Canvas";

const Editor = () => {
  const actionManager = useRef<ActionManager>();
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const createProject = () => {
      const clientId = "1";
      const key = "abc";

      const project = new Project(clientId, key);
      const page = project.createPage("pageA");
      project.appendChild(page);
      let line = project.createLine("l1");
      page.appendChild(line);
      line.x1 = 60;
      line.y1 = 70;
      line.x2 = 250;
      line.y2 = 150;
      line = project.createLine("l2");
      page.appendChild(line);
      line.x1 = 80;
      line.y1 = 50;
      line.x2 = 230;
      line.y2 = 120;
      return project;
    };
    const project = createProject();
    actionManager.current = new ActionManager({ project: project });
    setProject(project);
  }, []);

  if (!project) {
    return <div>loading project</div>;
  }

  return (
    <div className="Editor">
      <Canvas project={project} actionManager={actionManager.current!}></Canvas>
    </div>
  );
};

export default Editor;
