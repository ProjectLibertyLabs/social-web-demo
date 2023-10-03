import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ReviewApp from "./ReviewApp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
if (document.location.pathname.endsWith("/review")) {
root.render(
  <React.StrictMode>
    <ReviewApp />
  </React.StrictMode>
);
} else {
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
}