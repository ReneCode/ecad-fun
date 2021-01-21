import React from "react";
import { registerAction } from "./registerAction";
import Dialog from "../components/Dialogs/Dialog";
import PageListDialog from "../components/Dialogs/PageListDialog";

export const actionPageList = registerAction({
  name: "pageList",

  execute: ({ state, project }) => {
    return { showDialog: true };
  },

  render: ({ project, state }) => {
    return (
      <Dialog>
        <PageListDialog project={project} />
      </Dialog>
    );
  },
});
