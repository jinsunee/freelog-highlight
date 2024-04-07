import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const mainElement = document.createElement("freelog-highlighter-container");
mainElement.id = "freelog-highlighter-container";

const shadowRoot = mainElement.attachShadow({ mode: "open" });

const rootElement = document.createElement("freelog-highlighter-root");
rootElement.id = "freelog-highlighter-root";

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

shadowRoot.appendChild(rootElement);
document.body.appendChild(mainElement);
