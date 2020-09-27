import React from "react";
import { AppState, ECadSymbolElement, ECadBaseElement } from "../types";
import SymbolListItem from "./SymbolListItem";
import "./SymbolList.scss";
import { ActionManager } from "../actions/actionManager";
// import { Project } from "../data/Project";

type Props = {
  state: AppState;
  // project: Project;
  actionManager: ActionManager;
};
const SymbolList: React.FC<Props> = ({ state, actionManager }) => {
  const onSelectSymbol = (symbol: ECadSymbolElement) => {
    actionManager.execute("placeSymbol", { params: symbol });
  };

  return null;

  // let symbols: ECadBaseElement[] = project
  //   .getElements()
  //   .filter((e) => e.type === "symbol");
  // return (
  //   <div className="symbollist">
  //     {symbols.map((e) => {
  //       return (
  //         <SymbolListItem
  //           key={e.id}
  //           symbol={e as ECadSymbolElement}
  //           onPointerDown={() => onSelectSymbol(e as ECadSymbolElement)}
  //         />
  //       );
  //     })}
  //   </div>
  // );
};

export default SymbolList;

// {symbols.map((e) => {
//   return (
//     <SymbolListItem
//       key={e.id}
//       symbol={e as ECadSymbolElement}
//       onPointerDown={() => onSelectSymbol(e.id)}
//     />
//   );
// })}
