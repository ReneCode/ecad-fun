import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphicEditor from "./GraphicEditor";
import { AppState } from "../types";
import { saveDebounced } from "../state";
import { Socket } from "../data/Socket";
import { Project } from "multiplayer";

const ProjectStart = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState((null as unknown) as Project);
  const [socket, setSocket] = useState((null as unknown) as Socket);

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("init");
    const project = new Project(projectId);
    setProject(project);
    setSocket(new Socket(project));
    window.addEventListener("resize", onResize);
    return () => {
      setSocket((undefined as unknown) as Socket);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  const onChange = (appState: AppState, project: Project) => {
    saveDebounced(appState, project);
  };

  if (project && socket) {
    return (
      <GraphicEditor
        width={size.width}
        height={size.height}
        onChange={onChange}
        project={project}
        socket={socket}
      />
    );
  } else {
    return null;
  }
};

export default ProjectStart;
