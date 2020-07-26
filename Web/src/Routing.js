import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import ProjectStart from "./components/ProjectStart";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/p/:id" component={ProjectStart}></Route>
    </Switch>
  );
};

export default Routing;
