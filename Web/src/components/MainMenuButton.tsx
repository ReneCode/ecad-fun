import React from "react";
import { useHistory } from "react-router";
import { ActionManager } from "../actions/actionManager";
import { ActionParams } from "../types";
import IconButton from "./common/IconButton";
import ContextMenu from "./ContextMenu";

import "./MainMenuButton.scss";

type Props = {
  actionParams: ActionParams;
};
const MainMenuButton: React.FC<Props> = ({ actionParams }) => {
  const { actionManager, getState } = actionParams;

  const history = useHistory();

  const onHome = () => {
    history.push("/");
  };

  const executeAction = (actionName: string) => {
    actionManager.execute(actionName, {});
  };

  const onPageList = () => {
    const pageListName = "pageList";
    let newList: string[] = [];
    const state = getState();
    if (state.openDialogs.includes(pageListName)) {
      // remove
      newList = state.openDialogs.filter((n) => n != pageListName);
    } else {
      newList = state.openDialogs.concat(pageListName);
    }

    actionManager.process({ state: { openDialogs: newList } });

    // actionManager.process({state: state.openDialogs. }})
    // executeAction("pageList");
  };

  // show context menu
  const onClick = (ev: React.MouseEvent) => {
    ContextMenu.push({
      top: 60,
      left: 4,
      options: [
        {
          label: "Home",
          onClick: () => onHome(),
        },
        {
          label: "---",
        },
        {
          label: "PageList",
          onClick: () => onPageList(),
        },
        { label: "Grid", onClick: () => executeAction("switchGrid") },
      ],
    });
  };

  return (
    <div className="main-menu">
      <IconButton onClick={onClick} icon="menu"></IconButton>
    </div>
  );
};

export default MainMenuButton;
