import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Editor from "./Editor";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/p/:key" component={Editor}></Route>
    </Switch>
  );
};

export default Routing;
