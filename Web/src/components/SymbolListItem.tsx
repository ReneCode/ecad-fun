import React from "react";
import { AppState, ECadBaseElement, ECadSymbolElement } from "../types";

import "./SymbolList.scss";

type Props = {
  symbol: ECadSymbolElement;
  onClick: () => void;
};
const SymbolList: React.FC<Props> = ({ symbol, onClick }) => {
  return (
    <div className="symbollistitem" onClick={onClick}>
      {symbol.id}
    </div>
  );
};

export default SymbolList;
