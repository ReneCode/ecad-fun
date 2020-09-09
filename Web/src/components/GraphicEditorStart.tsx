import React, { useEffect, useState } from "react";
import GraphicEditor from "./GraphicEditor";
import { AppState, ECadBaseElement } from "../types";
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

  const onChange = (
    appState: AppState,
    elements: readonly ECadBaseElement[]
  ) => {
    saveDebounced(appState, elements);
  };

  return (
    <GraphicEditor
      width={size.width}
      height={size.height}
      onChange={onChange}
    />
  );
};

export default ProjectStart;
