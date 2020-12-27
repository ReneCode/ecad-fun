import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./Home.scss";

import Header from "./Header";
import Loading from "./Loading";

const App = () => {
  const { isLoading } = useAuth0();

  return (
    <div className="home">
      <Header></Header>
      {!isLoading ? (
        <div className="home-content">
          <p>ECAD.fun</p>
          <a href="/p/abc">Project</a>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default App;
