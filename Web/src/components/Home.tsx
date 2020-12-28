import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Home.scss";

import ProjectList from "./ProjectList";
import { useUserId } from "./useUserId";

import Header from "./Header";

const App = () => {
  const { isLoading, user } = useAuth0();
  const userHash = useUserId();

  if (isLoading || !user) {
    return (
      <div className="home">
        <Header></Header>
      </div>
    );
  }

  return (
    <div className="home">
      <Header></Header>
      <div>
        <p>ECAD.fun</p>
        <pre>{userHash}</pre>
        <ProjectList />
        <nav>
          <ul>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/p/abc">Project abc</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default App;
