import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import GraphicEditorStart from "./components/GraphicEditorStart";
import PrivateRoute from "./components/auth/PrivateRoute";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <PrivateRoute
        exact
        path="/p/:id"
        component={GraphicEditorStart}
      ></PrivateRoute>
    </Switch>
  );
};

export default Routing;
