import React from "react";
import "./App.css";
// import { useOvermind } from "../overmind";

const App = () => {
  // const { state, actions } = useOvermind();

  const handleClick = () => {
    // actions.canvas.setName("B" + state.canvas.name);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <p onClick={handleClick}>{state.canvas.name} </p> */}
        <p>ECAD.fun</p>
        <a href="/p/abc">Project</a>
      </header>
    </div>
  );
};

export default App;
