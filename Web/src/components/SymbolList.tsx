import React from "react";
import { AppState, ECadSymbolElement } from "../types";
import SymbolListItem from "./SymbolListItem";
import "./SymbolList.scss";
import { ActionManager } from "../actions/actionManager";

type Props = {
  state: AppState;
  actionManager: ActionManager;
};
const SymbolList: React.FC<Props> = ({ state, actionManager }) => {
  const onSelectSymbol = (id: string) => {
    actionManager.execute("placeSymbol", { params: id });
  };

  return (
    <div className="symbollist">
      {state.elements
        .filter((e) => e.type === "symbol")
        .map((e) => {
          return (
            <SymbolListItem
              key={e.id}
              symbol={e as ECadSymbolElement}
              onClick={() => onSelectSymbol(e.id)}
            />
          );
        })}
    </div>
  );
};

export default SymbolList;
