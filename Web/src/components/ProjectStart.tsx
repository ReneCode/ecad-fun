import React, { useEffect, useState } from "react";
import Project from "./Project";

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

  return <Project width={size.width} height={size.height} />;
};

export default ProjectStart;
