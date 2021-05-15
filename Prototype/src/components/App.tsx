import { useEffect, useRef, useState } from "react";
import { EditLogType } from "../core/ecadfun.d";
import { ServerDispatcher } from "../core/ServerDispatcher";
import "./App.css";

import ProjectView from "./ProjectView";
import ServerView from "./ServerView";

const App = () => {
  const serverDispatcher = useRef<ServerDispatcher>();

  const serverView = useRef<ServerView>(null);
  const client1View = useRef<ProjectView>(null);
  const client2View = useRef<ProjectView>(null);
  const client3View = useRef<ProjectView>(null);

  useEffect(() => {
    const sendToClientCallback = (
      clientId: string,
      result: string,
      messageId: string,
      edits: EditLogType[]
    ) => {
      let project;
      if (clientId === "1") {
        project = client1View.current?.project;
      }
      if (clientId === "2") {
        project = client2View.current?.project;
      }
      if (clientId === "3") {
        project = client3View.current?.project;
      }

      project?.applyEdits(edits);
    };
    if (serverView.current) {
      serverDispatcher.current = new ServerDispatcher(
        serverView.current.project,
        sendToClientCallback
      );
      serverDispatcher.current.connectClient("1");
      serverDispatcher.current.connectClient("2");
      serverDispatcher.current.connectClient("3");
    }
  }, []);

  const onSendEditsToServer = async (
    clientId: string,
    edits: EditLogType[]
  ) => {
    await serverDispatcher.current?.receiveFromClient(clientId, "", edits);
  };

  return (
    <div className="App">
      <div className="header">
        <p>ecad.fun prototype</p>
      </div>
      <div className="grid">
        <ProjectView
          ref={client1View}
          onSendEditsToServer={onSendEditsToServer}
          clientId="1"
        />
        <ProjectView
          ref={client2View}
          onSendEditsToServer={onSendEditsToServer}
          clientId="2"
        />
        <ProjectView
          ref={client3View}
          onSendEditsToServer={onSendEditsToServer}
          clientId="3"
        />

        <ServerView ref={serverView} />
      </div>
    </div>
  );
};

export default App;
