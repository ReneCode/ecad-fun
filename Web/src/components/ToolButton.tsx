import React from "react";

import "./ToolButton.scss";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  selected?: boolean;
};
const ToolButton: React.FC<Props> = ({ onClick, children, selected }) => {
  return (
    <button className={selected ? "selected" : ""} onClick={onClick}>
      {children}
    </button>
  );
};

export default ToolButton;
