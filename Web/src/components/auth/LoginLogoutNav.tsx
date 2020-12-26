import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export const LoginLogoutNav = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <nav>
      <div>{user?.name}</div>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </nav>
  );
};

export default LoginLogoutNav;
