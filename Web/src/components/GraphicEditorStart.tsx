import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphicEditor from "./GraphicEditor";
import { AppState, ECadBaseElement } from "../types";
import { saveDebounced } from "../state";
import Socket from "./Socket";
import { Project } from "multiplayer";

const ProjectStart = () => {
  const { id: projectId } = useParams();
  const [project] = useState(new Project("local"));

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  const onChange = (
    appState: AppState,
    elements: readonly ECadBaseElement[]
  ) => {
    saveDebounced(appState, elements);
  };

  return (
    <div>
      <Socket projectId={projectId} project={project} />
      <GraphicEditor
        width={size.width}
        height={size.height}
        onChange={onChange}
        project={project}
      />
    </div>
  );
};

export default ProjectStart;
