import { useRef } from "react";
import { EditLogType } from "../core/ecadfun.d";
import "./App.css";

import ProjectView from "./ProjectView";
import ServerView from "./ServerView";

const App = () => {
  const serverView = useRef<ServerView>(null);
  const client1View = useRef<ProjectView>(null);
  const client2View = useRef<ProjectView>(null);
  const client3View = useRef<ProjectView>(null);

  const onSendEditsToServer = (clientId: string, data: EditLogType[]) => {
    serverView.current?.applyEdits(clientId, data);
  };

  const onSendEditsToClient = (edits: EditLogType[]) => {
    //  client1View.current?.applyEdits(edits);
    client2View.current?.applyEdits(edits);
    client3View.current?.applyEdits(edits);
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

        <ServerView
          ref={serverView}
          onSendEditsToClient={onSendEditsToClient}
        />
      </div>
    </div>
  );
};

export default App;
