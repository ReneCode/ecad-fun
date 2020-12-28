import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Home.scss";

import Header from "./Header";
import Loading from "./Loading";

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
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
