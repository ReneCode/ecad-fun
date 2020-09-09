import React from "react";
import { AppState, ECadSymbolElement, ECadBaseElement } from "../types";
import SymbolListItem from "./SymbolListItem";
import "./SymbolList.scss";
import { ActionManager } from "../actions/actionManager";

type Props = {
  state: AppState;
  elements: readonly ECadBaseElement[];
  actionManager: ActionManager;
};
const SymbolList: React.FC<Props> = ({ state, elements, actionManager }) => {
  const onSelectSymbol = (id: string) => {
    actionManager.execute("placeSymbol", { params: id });
  };

  return (
    <div className="symbollist">
      {elements
        .filter((e) => e.type === "symbol")
        .map((e) => {
          return (
            <SymbolListItem
              key={e.id}
              symbol={e as ECadSymbolElement}
              onPointerDown={() => onSelectSymbol(e.id)}
            />
          );
        })}
    </div>
  );
};

export default SymbolList;
