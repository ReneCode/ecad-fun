import { render } from "react-dom"
import React from "react"

import "./ContextMenu.scss"
import Popover from "./Popover"

type ContextMenuOption = {label:string, action: () => void }

type Props = {
    top:number
    left: number,
    options: ContextMenuOption[]
}

const ContextMenu : React.FC<Props>= ({top, left, options}) => {
    return <Popover top={top} left={left} >
        <div className="menu">
<ul className="menu-options">
    <li>Delete</li>
</ul>
    </div>
        ╬</Popover>
}


type  ContextMenuParams = {
options:ContextMenuOption []
, top: number, left: number
}

let contextMenuNode: HTMLDivElement;
const getContextMenuNode = (): HTMLDivElement => {
  if (contextMenuNode) {
    return contextMenuNode;
  }
  const div = document.createElement("div");
  document.body.appendChild(div);
  return (contextMenuNode = div);
};

const push = (params: ContextMenuParams) => {
    if (params.options.length >0) {
        render(<ContextMenu top={params.top} left={params.left} options={params.options}></ContextMenu>, getContextMenuNode())
    }
}


export default {push};