import React from "react";
import { EditLogType } from "../core/ecadfun.d";
import { PageNode, Project } from "../core/Project";

import "./ProjectView.scss";

import PageList from "./PageList";

type Props = {
  clientId: string;
  onSendEditsToServer: (clientId: string, data: EditLogType[]) => void;
};
class ProjectView extends React.Component<Props> {
  project: Project;
  clientId: string;

  constructor(props: Props) {
    super(props);
    const { clientId, onSendEditsToServer } = props;
    this.clientId = clientId;
    this.project = new Project(clientId, "key", (data: EditLogType[]) => {
      onSendEditsToServer(this.clientId, data);
    });

    this.onCreate = this.onCreate.bind(this);
  }

  applyEdits(msg: string) {
    console.log(`client: ${this.clientId} got: ${msg}`);
    this.setState({});
  }

  onCreate() {
    const pages = this.project.findAll((n) => n.type === "PAGE");
    const page = this.project.createPage(`page-${pages.length + 1}`);
    this.project.appendChild(page);
    this.project.flushEdits();
    this.setState({ name: "hallo" });
  }

  render() {
    const pages = this.project.findAll((n) => n.type === "PAGE") as PageNode[];
    return (
      <div className="project-view">
        <h3>client: {this.clientId}</h3>
        <button onClick={this.onCreate}>Create</button>
        <PageList pages={pages}></PageList>
        <div className="page-list"></div>
      </div>
    );
  }
}

export default ProjectView;
