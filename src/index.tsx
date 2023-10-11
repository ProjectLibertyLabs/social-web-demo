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
      <h1>
        <a href="/review?href=https://www.etsy.com/listing/1292521772/melting-clock-salvador-dali-the&reference=%7B%22hello%22%3A%22world%22%7D&attributeSetType=dsnp%3A%2F%2F1%23OndcProofOfPurchase&text=%E2%AD%90%20%E2%AD%90%20%E2%AD%90%20%E2%AD%90%20%E2%AD%90%0D%0DThis+is+my+review&success_url=/feed&error_url=https://dsnp.org/">
          LOCAL - Post a Review
        </a>
      </h1>
      <br />
      <h1>
        <a href="/review?href=https://www.etsy.com/listing/1292521772/melting-clock-salvador-dali-the&reference=%7B%22hello%22%3A%22world%22%7D&attributeSetType=dsnp%3A%2F%2F13972%23OndcProofOfPurchase&text=%E2%AD%90%20%E2%AD%90%20%E2%AD%90%20%E2%AD%90%20%E2%AD%90%0D%0DThis+is+my+testnet+review&success_url=/feed&error_url=https://dsnp.org/">
          TESTNET - Post a Review
        </a>
      </h1>
      <br />
      <h1>
        <a href="/feed">View your feed</a>
      </h1>
    </React.StrictMode>,
  );
}
