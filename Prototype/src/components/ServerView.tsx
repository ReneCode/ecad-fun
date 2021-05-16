import React from "react";
import { EditLogType } from "../core/ecadfun.d";
import { PageNode, Project } from "../core/Project";
import PageList from "./PageList";

import "./ServerView.scss";

type Props = {};
class ServerView extends React.Component<Props> {
  project: Project;

  constructor(props: Props) {
    super(props);
    this.project = new Project("0", "key");

    this.project.on("all", () => {
      // redraw
      this.setState({});
    });
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
