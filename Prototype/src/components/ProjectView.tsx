import React from "react";
import { EditLogType } from "../core/ecadfun.d";
import { PageNode, Project } from "../core/Project";
import { ClientSendEditsQue } from "../core/ClientSendEditsQue";

import "./ProjectView.scss";

import PageList from "./PageList";

type Props = {
  clientId: string;
  onSendEditToServer: (clientId: string, id: number, edit: EditLogType) => void;
};
class ProjectView extends React.Component<Props> {
  project: Project;
  clientSendEditQue: ClientSendEditsQue;

  constructor(props: Props) {
    super(props);
    this.project = new Project(props.clientId, "key");

    this.project.on("all", () => {
      // redraw
      this.setState({});
    });

    this.clientSendEditQue = new ClientSendEditsQue(
      this.project,
      (id: number, edit: EditLogType) => {
        this.props.onSendEditToServer(this.props.clientId, id, edit);
      }
    );
    this.onCreate = this.onCreate.bind(this);
  }

  receiveFromServer(
    result: "ack" | "reject" | "force",
    id: number,
    edit?: EditLogType
  ) {
    this.clientSendEditQue.receiveFromServer(result, id, edit);
  }

  // applyEdits(edits: EditLogType[]) {
  //   this.project.applyEdits(edits);
  //   console.log(`client: ${this.props.clientId} received edits`);
  // }

  onCreate() {
    const pages = this.project.findAll((n) => n.type === "PAGE");
    const page = this.project.createPage(`page-${pages.length + 1}`);
    this.project.appendChild(page);
    this.project.flushEdits();
  }

  render() {
    const pages = this.project.findAll((n) => n.type === "PAGE") as PageNode[];
    return (
      <div className="project-view">
        <h3>Client {this.props.clientId}</h3>
        <button onClick={this.onCreate}>Create</button>
        <PageList pages={pages}></PageList>
        <div className="page-list"></div>
      </div>
    );
  }
}

export default ProjectView;
