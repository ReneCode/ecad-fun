import React from "react";
import "./App.css";
// import { useOvermind } from "../overmind";

const App = () => {
  // const { state, actions } = useOvermind();

  return (
    <div className="App">
      <header className="App-header">
        {/* <p onClick={handleClick}>{state.canvas.name} </p> */}
        <p>ECAD.fun</p>
        <a href="/p/abc">project</a>
      </header>
    </div>
  );
};

export default App;
