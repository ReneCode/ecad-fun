import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Home.scss";

import { useUserId } from "./useUserId";

import Header from "./Header";

const App = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const userHash = useUserId();

  useEffect(() => {
    // try re-login after refreshing the page
    const callAPI = async () => {
      try {
        const _token = await getAccessTokenSilently();
      } catch (error) {
        console.log(error);
      }
    };
    if (!isLoading) {
      callAPI();
    }
  }, [isLoading, getAccessTokenSilently]);

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
        <nav>
          <ul>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
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
