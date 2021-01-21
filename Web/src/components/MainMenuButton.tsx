import React from "react";
import { useHistory } from "react-router";
import { ActionManager } from "../actions/actionManager";
import IconButton from "./common/IconButton";
import ContextMenu from "./ContextMenu";

import "./MainMenuButton.scss";

type Props = {
  actionManager: ActionManager;
};
const MainMenuButton: React.FC<Props> = ({ actionManager }) => {
  const history = useHistory();

  const onHome = () => {
    history.push("/");
  };

  const executeAction = (actionName: string) => {
    actionManager.execute(actionName, {});
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
          onClick: () => {
            executeAction("pageList");
          },
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
