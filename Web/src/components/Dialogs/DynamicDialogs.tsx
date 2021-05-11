import React, { useEffect, useState } from "react";

import { ActionManager } from "../../actions/actionManager";
import { ActionParams } from "../../types";
import Dialog from "./Dialog";

type Props = {
  actionManager: ActionManager;
  actionParams: ActionParams;
  dialogNames: string[];
};
const DynamicDialogs: React.FC<Props> = ({
  actionParams,
  dialogNames,
  actionManager,
}) => {
  const onClose = (name: string) => {
    actionManager.process({
      state: {
        openDialogs: actionParams
          .getState()
          .openDialogs.filter((n) => n !== name),
      },
    });
  };

  return (
    <React.Fragment>
      {dialogNames.map((name, index) => {
        return (
          <Dialog key={index} onClose={() => onClose(name)}>
            {actionManager.renderAction(name, actionParams)}
          </Dialog>
        );
      })}
    </React.Fragment>
  );
};

export default DynamicDialogs;
