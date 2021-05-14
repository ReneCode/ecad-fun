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

  const onSendToClient = () => {};

  const onApplyEdits = () => {
    client1View.current?.applyEdits("hello client");
    client2View.current?.applyEdits("hello client");
    client3View.current?.applyEdits("hello client");
  };

  return (
    <div className="App">
      <div className="header">
        <p>ecad.fun prototype</p>
        <button onClick={onApplyEdits}>apply edits</button>
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

        <ServerView ref={serverView} onSendToClient={onSendToClient} />
      </div>
    </div>
  );
};

export default App;
