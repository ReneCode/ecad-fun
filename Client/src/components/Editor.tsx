import { useCallback, useEffect, useRef, useState } from "react";

import { PageNode, Project } from "../core/Project";

import { Graphic } from "./graphic/Graphic";

import "./Editor.scss";

const Editor = () => {
  const graphic = useRef<Graphic>(new Graphic());
  const canvas = useRef<HTMLCanvasElement>(null);
  const projectRef = useRef<Project>();

  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const clientId = "1";
    const key = "abc";

    const project = new Project(clientId, key);
    projectRef.current = project;
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

    const resizeHandler = (ev: UIEvent) => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (canvas.current) {
      const page = projectRef.current?.children[0] as PageNode;
      if (page) {
        graphic.current.render(canvas.current, page);
      }
    }
  });

  return (
    <div className="Editor">
      <canvas ref={canvas} width={size.w} height={size.h}></canvas>
    </div>
  );
};
export default Editor;
