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
      result: "ack" | "reject" | "ok",
      id: number,
      edit?: EditLogType
    ) => {
      let projectView;
      if (clientId === "1") {
        projectView = client1View.current;
      }
      if (clientId === "2") {
        projectView = client2View.current;
      }
      if (clientId === "3") {
        projectView = client3View.current;
      }

      projectView?.receiveFromServer(result, id, edit);
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

  const onSendEditToServer = async (
    clientId: string,
    id: number,
    edit: EditLogType
  ) => {
    await serverDispatcher.current?.receiveFromClient(clientId, id, edit);
  };

  return (
    <div className="App">
      <div className="header">
        <p>ecad.fun prototype</p>
      </div>
      <div className="grid">
        <ProjectView
          ref={client1View}
          onSendEditToServer={onSendEditToServer}
          clientId="1"
        />
        <ProjectView
          ref={client2View}
          onSendEditToServer={onSendEditToServer}
          clientId="2"
        />
        <ProjectView
          ref={client3View}
          onSendEditToServer={onSendEditToServer}
          clientId="3"
        />

        <ServerView ref={serverView} />
      </div>
    </div>
  );
};

export default App;
