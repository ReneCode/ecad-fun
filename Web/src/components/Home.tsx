import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./App.css";

import LoginLogoutNav from "./auth/LoginLogoutNav";

const App = () => {
  const { isLoading } = useAuth0();

  return (
    <div className="App">
      <header className="App-header">
        {/* <p onClick={handleClick}>{state.canvas.name} </p> */}
        <nav>{isLoading ? <div>...</div> : <LoginLogoutNav />}</nav>
        <p>ECAD.fun</p>
        <a href="/p/abc">Project</a>
      </header>
    </div>
  );
};

export default App;
