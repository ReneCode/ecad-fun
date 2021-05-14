import "./App.css";

import ProjectView from "./ProjectView";

function App() {
  return (
    <div className="App">
      <header>
        <p>ecad.fun prototype</p>
      </header>
      <div className="grid">
        <ProjectView clientId="1" />
        <ProjectView clientId="2" />
        <ProjectView clientId="3" />
      </div>
    </div>
  );
}

export default App;
