import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { user } = useAuth0();

  return (
    <div>
      <p>Profile</p>
      <div>Name: {user?.name}</div>
      <div>email: {user?.email}</div>
      <div>id: {user?.sub}</div>
      <pre>JSON: {JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Profile;
