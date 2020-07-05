import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Project from "./components/Project";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/p/:id" component={Project}></Route>
    </Switch>
  );
};

export default Routing;
