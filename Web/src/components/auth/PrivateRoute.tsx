import React from "react";

import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading";

type Props = { component: React.ComponentType };
const PrivateRoute: React.FC<Props> = ({ component, ...args }) => {
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loading />,
      })}
      {...args}
    ></Route>
  );
};

export default PrivateRoute;
