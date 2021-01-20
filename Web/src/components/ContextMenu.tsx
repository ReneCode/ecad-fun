import { render, unmountComponentAtNode } from "react-dom";
import React from "react";

import "./ContextMenu.scss";
import Popover from "./Popover";

type ContextMenuOption = { label: string; onClick?: () => void };

type Props = {
  top: number;
  left: number;
  onCloseRequest?(): void;

  options: ContextMenuOption[];
};

const ContextMenu: React.FC<Props> = ({
  top,
  left,
  onCloseRequest,
  options,
}) => {
  return (
    <Popover top={top} left={left} onCloseRequest={onCloseRequest}>
      <ul className="context-menu">
        {options.map(({ label, onClick }) => {
          return (
            <li className="context-menu-option" onClick={onCloseRequest}>
              {onClick ? <button onClick={onClick}>{label}</button> : <hr></hr>}
            </li>
          );
        })}
      </ul>
    </Popover>
  );
};

type ContextMenuParams = {
  options: ContextMenuOption[];
  top: number;
  left: number;
};

let contextMenuNode: HTMLDivElement;
const getContextMenuNode = (): HTMLDivElement => {
  if (contextMenuNode) {
    return contextMenuNode;
  }
  const div = document.createElement("div");
  document.body.appendChild(div);
  return (contextMenuNode = div);
};

const handleClose = () => {
  unmountComponentAtNode(getContextMenuNode());
};

const push = (params: ContextMenuParams) => {
  const options = Array.of<ContextMenuOption>();
  params.options.forEach((option) => {
    if (option) {
      options.push(option);
    }
  });
  if (options.length) {
    render(
      <ContextMenu
        top={params.top}
        left={params.left}
        options={options}
        onCloseRequest={handleClose}
      ></ContextMenu>,
      getContextMenuNode()
    );
  }
};

export default { push };
