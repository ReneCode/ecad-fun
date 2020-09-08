import React from "react";
import { ECadSymbolElement } from "../types";

import "./SymbolList.scss";

type Props = {
  symbol: ECadSymbolElement;
  onPointerDown: () => void;
};
const SymbolList: React.FC<Props> = ({ symbol, onPointerDown }) => {
  return (
    <div className="symbollistitem" onPointerDown={onPointerDown}>
      {symbol.name}
    </div>
  );
};

export default SymbolList;
