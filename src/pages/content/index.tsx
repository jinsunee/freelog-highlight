// 예: src/ContentScriptApp.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 메인 DOM 요소 생성
const mainElement = document.createElement("freelog-highlighter-container");
mainElement.id = "freelog-highlighter-container";

// Shadow DOM 생성
const shadowRoot = mainElement.attachShadow({ mode: "open" });

// Shadow DOM 내에 React 렌더링을 위한 루트 요소 생성
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
