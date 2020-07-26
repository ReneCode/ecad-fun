import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

// import { Provider as OvermindProvider } from "overmind-react";

import "./index.scss";
import * as serviceWorker from "./serviceWorker";

import Routing from "./Routing";
// import { overmind } from "./overmind";

ReactDOM.render(
  <React.StrictMode>
    {/* <OvermindProvider value={overmind}> */}
    <Router>
      <Routing />
    </Router>
    {/* </OvermindProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
