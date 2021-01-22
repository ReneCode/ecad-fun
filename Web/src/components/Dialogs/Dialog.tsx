import React from "react";

import "./Dialog.scss";

type Props = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

const Dialog: React.FC<Props> = ({ children, title, onClose }) => {
  return (
    <div className="dialog-container">
      <div className="dialog-header">
        <div>{title}</div>
        <button onClick={onClose}> X</button>
      </div>
      <div className="dialog-content">{children}</div>
    </div>
  );
};

export default Dialog;
