import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphicEditor from "./GraphicEditor";
import { AppState } from "../types";
import { saveDebounced } from "../state";
import { Project } from "multiplayer";

const ProjectStart = () => {
  const { id: projectId } = useParams();

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("init");
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  const onChange = (appState: AppState, project: Project) => {
    saveDebounced(appState, project);
  };

  return (
    <GraphicEditor
      width={size.width}
      height={size.height}
      onChange={onChange}
      projectId={projectId}
    />
  );
};

export default ProjectStart;
