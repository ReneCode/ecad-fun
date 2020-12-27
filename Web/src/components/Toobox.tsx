import React from "react";
import { useHistory } from "react-router";
import ToolButton from "./ToolButton";

type Props = {
  onClick: (actionName: string) => void;
};
const Toolbox: React.FC<Props> = ({ onClick }) => {
  const history = useHistory();

  return (
    <div className="toolbox">
      <ToolButton
        onClick={() => {
          history.push("/");
        }}
      >
        Home
      </ToolButton>
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
