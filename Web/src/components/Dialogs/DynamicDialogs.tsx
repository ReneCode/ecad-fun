import React from "react";

import { ActionManager } from "../../actions/actionManager";
import { showDynamicDialogs } from "./showDynamicDialogs";

type Props = {
  actionManager: ActionManager;
};
const DynamicDialogs: React.FC<Props> = ({ actionManager }) => {
  const names = showDynamicDialogs.getNames();
  return (
    <React.Fragment>
      {names.map((name, index) => {
        return (
          <React.Fragment key={index}>
            {actionManager.renderAction(name)}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default DynamicDialogs;
