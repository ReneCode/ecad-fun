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

  constructor(props: Props) {
    super(props);
    this.project = new Project(props.clientId, "key", (data: EditLogType[]) => {
      props.onSendEditsToServer(this.props.clientId, data);
    });

    this.project.on("all", () => {
      // redraw
      this.setState({});
    });

    this.onCreate = this.onCreate.bind(this);
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
