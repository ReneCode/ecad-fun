import React from "react";

import "./Button.scss";

type ButtonType = undefined | "dot"

type Props = { children?: React.ReactNode; onClick: (ev:any) => void; type?:ButtonType  };
const Button: React.FC<Props> = ({ children, onClick, type }) => {
  return <button className={type=== "dot"? "dot" : "btn"} onClick={ev => onClick(ev)    }>{children?children:null}</button>;
};

export default Button;
