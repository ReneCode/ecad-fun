import React, { useEffect, useState } from "react";
import Project from "./Project";
import { AppState } from "../types";
import { saveDebounced } from "../state";

const ProjectStart = () => {
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

  const onChange = (appState: AppState) => {
    saveDebounced(appState);
  };

  return (
    <Project width={size.width} height={size.height} onChange={onChange} />
  );
};

export default ProjectStart;
