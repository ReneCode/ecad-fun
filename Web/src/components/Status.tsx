import React from "react";

type Props = {
  x: number;
  y: number;
};
const Status: React.FC<Props> = ({ x, y }) => {
  return (
    <div className="status">
      x:{x} y:{y}
    </div>
  );
};

export default Status;
