import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import GraphicEditorStart from "./components/GraphicEditorStart";
import PrivateRoute from "./components/auth/PrivateRoute";
import Profile from "./components/Profile";
import Tmp from "./components/Tmp";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/tmp" component={Tmp}></Route>
      <Route exact path="/profile" component={Profile}></Route>
      <PrivateRoute
        exact
        path="/p/:id"
        component={GraphicEditorStart}
      ></PrivateRoute>
    </Switch>
  );
};

export default Routing;
