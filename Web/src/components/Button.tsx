import React from "react";

import "./Button.scss";

type Props = { children: React.ReactNode; onClick: () => void };
const Button: React.FC<Props> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default Button;
