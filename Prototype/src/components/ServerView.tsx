import React from "react";
import { EditLogType } from "../core/ecadfun.d";

type Props = {
  onSendToClient: (data: EditLogType[]) => void;
};
class ServerView extends React.Component<Props> {
  public applyEdits(clientId: string, data: EditLogType[]) {
    console.log(
      `Server got from client: ${clientId} message: ${JSON.stringify(data)}`
    );
  }

  render() {
    return <div>ServerView</div>;
  }
}

export default ServerView;
