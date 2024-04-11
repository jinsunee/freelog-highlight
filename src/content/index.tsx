import "@webcomponents/custom-elements";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./freelog-highlight";
import "./index.css";

const mainElement = document.createElement("freelog-highlighter-toolbox-popup");

const shadowDOM = mainElement.attachShadow({ mode: "open" });

const root = ReactDOM.createRoot(shadowDOM);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.body.appendChild(mainElement);
