import React from "react";
import ToolButton from "./ToolButton";

type Props = {
  onClick: (actionName: string) => void;
};
const Toolbox: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="toolbox">
      <ToolButton onClick={() => onClick("line")}>line</ToolButton>
      <ToolButton onClick={() => onClick("circle")}>circle</ToolButton>
    </div>
  );
};

export default Toolbox;
