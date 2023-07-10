import React from "react";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

interface MissingWalletProps {
  hasWalletExtension: boolean;
}

const MissingWallet = ({ hasWalletExtension }: MissingWalletProps): JSX.Element => {

  return (
    <div>
      <Title level={2}>Wallet Extension {!hasWalletExtension && "Not Installed"}</Title>
      <Paragraph>
        To use this application, you need to install and enable a Polkadot compatible browser extension.
      </Paragraph>
      {hasWalletExtension && (<Paragraph>
        Please enable website access and try again.
      </Paragraph>)}
      {!hasWalletExtension && (<><Paragraph>
        Please follow the steps below to install the Polkadot.js Extension:
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
      </ol></>)}
    </div>
  );
};

export default MissingWallet;
