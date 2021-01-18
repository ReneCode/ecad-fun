import React from "react";
import { useHistory } from "react-router";
import ToolButton from "./ToolButton";
import IconButton from "./common/IconButton";
type Props = {
  currentActionName: string;
  onClick: (actionName: string) => void;
};
const Toolbox: React.FC<Props> = ({ onClick, currentActionName }) => {
  const history = useHistory();

  const buttons = [
    { action: "select", label: "select" },
    { action: "line", label: "line" },
    { action: "circle", label: "circle" },
    { action: "rectangle", label: "rectangle" },
  ];
  return (
    <div className="toolbox">
      <ToolButton
        onClick={() => {
          history.push("/");
        }}
      >
        Home
      </ToolButton>
      {buttons.map((b) => {
        return (
          <ToolButton
            selected={currentActionName === b.action}
            onClick={() => onClick(b.action)}
          >
            {b.label}
          </ToolButton>
        );
      })}
      {/* <ToolButton onClick={() => onClick("select")}>select</ToolButton> */}
      <ToolButton onClick={() => onClick("delete")}>x</ToolButton>
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
