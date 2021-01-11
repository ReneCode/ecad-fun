import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import GraphicEditor from "./GraphicEditor";
import { AppState } from "../types";
import { saveDebounced } from "../state";
import { Project } from "../share";

const ProjectStart = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const location = useLocation();

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
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

  const pageId = new URLSearchParams(location.search).get("pid") || "";

  return (
    <GraphicEditor
      width={size.width}
      height={size.height}
      onChange={onChange}
      projectId={projectId}
      pageId={pageId}
    />
  );
};

export default ProjectStart;
