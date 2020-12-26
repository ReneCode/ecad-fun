import React from "react";
import ToolButton from "./ToolButton";

type Props = {
  onClick: (actionName: string) => void;
};
const Toolbox: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="toolbox">
      <ToolButton onClick={() => onClick("navigateHome")}>Home</ToolButton>
      {/* <ToolButton onClick={() => onClick("select")}>select</ToolButton> */}
      <ToolButton onClick={() => onClick("line")}>line</ToolButton>
      <ToolButton onClick={() => onClick("circle")}>circle</ToolButton>
      <ToolButton onClick={() => onClick("rectangle")}>rectangle</ToolButton>
      <ToolButton onClick={() => onClick("delete")}>X</ToolButton>
      <ToolButton onClick={() => onClick("zoomIn")}>+</ToolButton>
      <ToolButton onClick={() => onClick("zoomOut")}>-</ToolButton>
      <ToolButton onClick={() => onClick("createSymbol")}>
        create symbol
      </ToolButton>
      <ToolButton onClick={() => onClick("exportDocument")}>export</ToolButton>
    </div>
  );
};

export default Toolbox;
