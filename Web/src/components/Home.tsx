import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Home.scss";

// import { useUserId } from "./useUserId";

import Header from "./Header";

const App = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  // const userHash = useUserId();

  useEffect(() => {
    // try re-login after refreshing the page
    const callAPI = async () => {
      try {
        // console.log("refresh page - before getAccessTokenSilently");
        const _token = await getAccessTokenSilently();
      } catch (error) {
        console.log(
          "refresh page - exception in getAccessTokenSilently",
          error
        );
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

  return <Redirect to="/projects"></Redirect>;
};

export default App;
