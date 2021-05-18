import { useEffect, useRef, useState } from "react";

import { PageNode, Project } from "../core/Project";

import { Graphic } from "./graphic/Graphic";

import "./Canvas.scss";
import { ActionManager } from "../actions/actionManager";

type Props = {
  project: Project;
  actionManager: ActionManager;
};
const Canvas: React.FC<Props> = ({ project, actionManager }: Props) => {
  const graphic = useRef<Graphic>(new Graphic());
  const canvas = useRef<HTMLCanvasElement>(null);

  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const resizeHandler = (ev: UIEvent) => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    console.log("WHEEL");
    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      if (event.metaKey || event.ctrlKey) {
        actionManager.execute("zoomPinch");
      } else {
        actionManager.execute("panning");
      }
    };
    if (canvas.current) {
      canvas.current.addEventListener("wheel", wheelHandler, {
        passive: false,
      });
      const cv = canvas.current;
      return () => cv.removeEventListener("wheel", wheelHandler);
    }
  }, [actionManager]);

  useEffect(() => {
    if (canvas.current) {
      const page = project.children[0] as PageNode;
      if (page) {
        graphic.current.render(canvas.current, page);
      }
    }
  });

  return <canvas ref={canvas} width={size.w} height={size.h}></canvas>;
};
export default Canvas;
