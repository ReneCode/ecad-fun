import React from "react";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
};
const ToolButton: React.FC<Props> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default ToolButton;
