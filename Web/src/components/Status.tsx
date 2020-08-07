import React from "react";

type Props = {
  x: number;
  y: number;
};
const Status: React.FC<Props> = ({ x, y }) => {
  return (
    <div className="status">
      x:{Math.floor(x)} y:{Math.floor(y)}
    </div>
  );
};

export default Status;
