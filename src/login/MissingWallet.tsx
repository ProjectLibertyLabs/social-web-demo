import React from "react";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const MissingWallet = (): JSX.Element => {
  return (
    <div>
      <Title level={2}>Polkadot.js Extension Not Detected</Title>
      <Paragraph>
        To use this application, you need to install the Polkadot.js browser
        extension.
      </Paragraph>
      <Paragraph>
        Please follow the steps below to install the extension:
      </Paragraph>
      <ol>
        <li>Open the Chrome or Firefox web browser.</li>
        <li>Go to the Polkadot.js Extension page:</li>
        <ul>
          <li>
            For Chrome:{" "}
            <a href="https://chrome.google.com/webstore/detail/polkadot-extension/mopnmbcafiedpnkjflobknpbkklhhnge">
              Polkadot.js Extension
            </a>
          </li>
          <li>
            For Firefox:{" "}
            <a href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/">
              Polkadot.js Extension
            </a>
          </li>
        </ul>
        <li>
          Click on "Add to Chrome" or "Add to Firefox" to install the extension.
        </li>
        <li>
          Once the installation is complete, click the extension icon in your
          browser toolbar to open it.
        </li>
        <li>
          Follow the extension's setup instructions and create a new account or
          import an existing one.
        </li>
        <li>Return to this application and try connecting again.</li>
      </ol>
    </div>
  );
};

export default MissingWallet;
