import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ReviewApp from "./ReviewApp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
if (document.location.pathname.endsWith("/review")) {
  root.render(
    <React.StrictMode>
      <ReviewApp />
    </React.StrictMode>,
  );
} else if (document.location.pathname.endsWith("/feed")) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
    <h1><a href="/review?href=https://www.etsy.com/listing/1292521772/melting-clock-salvador-dali-the&reference=%7B%22hello%22%3A%22world%22%7D&attributeSetType=dsnp%3A%2F%2F1%23OndcProofOfPurchase">Post a review</a></h1><br/>
    <h1><a href="/feed">View your feed</a></h1>
    </React.StrictMode>,
  );
}
