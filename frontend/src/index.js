import React from "react";
import ReactDOM from "react-dom";
//import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";

import App from "./app.js";

ReactDOM.render(
  <React.StrictMode>
    {/*  <BrowserRouter>
      <App />
    </BrowserRouter>*/}
      <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
