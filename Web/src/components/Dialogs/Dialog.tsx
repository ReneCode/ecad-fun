import React from "react";

type Props = {
  children: React.ReactElement;
};

const Dialog: React.FC<Props> = ({ children }) => {
  return <div className="action-component">{children}</div>;
};

export default Dialog;
