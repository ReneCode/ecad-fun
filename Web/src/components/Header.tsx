import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "./Button";
import GitHubLink from "./GitHubLink";

import "./Header.scss";

export const Header = () => {
  const { isAuthenticated, logout, loginWithRedirect, user } = useAuth0();
  return (
    <header className="header">
      <div className="home-icon">
        <Link to="/">{String.fromCodePoint(0x1f955)}</Link>
      </div>
      <div className="right">
        <div className="user-name">{user?.name}</div>
        {user && <img className="user-image" src={user?.picture} />}
        {isAuthenticated ? (
          <Button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out{" "}
          </Button>
        ) : (
          <Button onClick={() => loginWithRedirect()}>Log In </Button>
        )}
      </div>
      <GitHubLink />
    </header>
  );
};

export default Header;
