import React, { useEffect, useRef } from "react";
import { unstable_batchedUpdates } from "react-dom";

import "./Popover.scss";

type Props = {
  top: number;
  left: number;
  onCloseRequest?(event: PointerEvent): void;

  children: React.ReactNode;
};
const Popover: React.FC<Props> = ({ top, left, onCloseRequest, children }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onCloseRequest) {
      const handler = (event: PointerEvent) => {
        if (!popoverRef.current?.contains(event.target as Node)) {
          unstable_batchedUpdates(() => onCloseRequest(event));
        }
      };
      document.addEventListener("pointerdown", handler, false);
      return () => document.removeEventListener("pointerdown", handler, false);
    }
  }, [onCloseRequest]);

  return (
    <div className="popover" ref={popoverRef} style={{ top, left }}>
      {children}
    </div>
  );
};

export default Popover;
