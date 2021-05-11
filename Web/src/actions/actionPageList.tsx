import React from "react";
import { registerAction } from "./registerAction";
import PageListDialog from "../components/Dialogs/PageListDialog";

export const actionPageList = registerAction({
  name: "pageList",

  render: ({ project, state }) => {
    return <PageListDialog project={project} />;
  },
});
