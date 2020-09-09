import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import GraphicEditorStart from "./components/GraphicEditorStart";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/p/:id" component={GraphicEditorStart}></Route>
    </Switch>
  );
};

export default Routing;
