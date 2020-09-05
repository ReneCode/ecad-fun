import React from "react";
import ToolButton from "./ToolButton";

type Props = {
  onClick: (symbolName: string) => void;
};
const SymbolList: React.FC<Props> = ({ onClick }) => {
  return <div className="symbollist"></div>;
};

export default SymbolList;
