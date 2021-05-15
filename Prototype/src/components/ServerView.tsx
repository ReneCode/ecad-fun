import React from "react";
import { EditLogType } from "../core/ecadfun.d";
import { PageNode, Project } from "../core/Project";
import PageList from "./PageList";

import "./ServerView.scss";

type Props = {
  onSendEditsToClient: (data: EditLogType[]) => void;
};
class ServerView extends React.Component<Props> {
  project: Project;

  constructor(props: Props) {
    super(props);
    this.project = new Project("0", "key", (edit: EditLogType[]) => {
      console.log("server edit-callbacks - do not call!");
      // props.onSendEditsToClient(edit);
    });
  }

  public applyEdits(clientId: string, edits: EditLogType[]) {
    console.log(
      `Server got from client: ${clientId} message: ${JSON.stringify(edits)}`
    );

    this.project.applyEdits(edits);
    this.props.onSendEditsToClient(edits);

    this.setState({});
  }

  render() {
    const pages = this.project.findAll((n) => n.type === "PAGE") as PageNode[];

    return (
      <div className="server-view">
        <h3>Server</h3>
        <PageList pages={pages}></PageList>
      </div>
    );
  }
}

export default ServerView;
