import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from "./Button";

import "./Header.scss";

export const Header = () => {
  const { isAuthenticated, logout, loginWithRedirect, user } = useAuth0();
  return (
    <header className="home-header">
      <div className="home-user-name">{user?.name}</div>
      {user && <img className="home-user-image" src={user?.picture} />}
      <div className="home-gap"></div>
      {isAuthenticated ? (
        <Button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out{" "}
        </Button>
      ) : (
        <Button onClick={() => loginWithRedirect()}>Log In </Button>
      )}
      <div className="home-gap"></div>
    </header>
  );
};

export default Header;
