import React, { useState } from "react";
import { Button, Select, Spin, Row, Col, Form } from "antd";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import MissingWallet from "./MissingWallet";
import * as dsnpLink from "../dsnpLink";
import CreateIdentity from "./CreateIdentity";
import Login from "./Login";
import { HandlesMap, UserAccount } from "../types";
import styles from "./LoginScreen.module.css";

const dsnpLinkCtx = dsnpLink.createContext();

interface LoginScreenProps {
  onLogin: (account: UserAccount, network: string) => void;
}

const toHandlesMap = (
  accountList: InjectedAccountWithMeta[],
  handles: dsnpLink.HandlesResponse[]
) => {
  const handleOnlyMap = handles.reduce(
    (prev, cur) => (cur.handle ? prev.set(cur.publicKey, cur.handle) : prev),
    new Map()
  );
  const handleMap: HandlesMap = new Map();
  for (const account of accountList) {
    handleMap.set(account.address, {
      account,
      handle: handleOnlyMap.get(account.address) || null,
    });
  }
  return handleMap;
};

const LoginScreen = ({ onLogin }: LoginScreenProps): JSX.Element => {
  // Assume it has a wallet extension until after we have called enable
  const [hasWalletExtension, setHasWalletExtension] = useState(true);
  const [extensionConnected, setExtensionConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("https://rpc.rococo.frequency.xyz");
  const [handlesMap, setHandlesMap] = useState<HandlesMap>(new Map());

  const connectExtension = async () => {
    try {
      setIsLoading(true);
      const enabled = await web3Enable("Social Web Example Client");
      if (enabled.length > 0) {
        const allAccounts = await web3Accounts();
        // Check each account for a handle.
        const accountsWithHandles = await dsnpLink.authHandles(
          dsnpLinkCtx,
          {},
          allAccounts.map((account) => account.address)
        );

        setHandlesMap(toHandlesMap(allAccounts, accountsWithHandles));
        setExtensionConnected(true);
        setIsLoading(false);
      } else {
        throw new Error("Failed to connect to Wallet");
      }
    } catch (e) {
      setHasWalletExtension(false);
      setHandlesMap(new Map());
      setExtensionConnected(false);
      setIsLoading(false);
      console.error(e);
    }
  };

  const handleNetworkChange = (value: string) => {
    setSelectedNetwork(value);
    // filter account list?
  };

  return (
    <div className={styles.root}>
      <Spin tip="Loading" size="large" spinning={isLoading}>
        <Row className={styles.content}>
          {!hasWalletExtension && !isLoading && <MissingWallet />}
          {hasWalletExtension && !extensionConnected && (
            <Form wrapperCol={{ span: 24 }} layout="vertical" size="large">
              <Form.Item label="Select Network">
                <Select<string>
                  onChange={handleNetworkChange}
                  placeholder="Select Network"
                  defaultValue={selectedNetwork}
                  options={[
                    { value: "https://1.rpc.frequency.xyz", label: "Frequency Mainnet" },
                    { value: "https://rpc.rococo.frequency.xyz", label: "Frequency Testnet" },
                    { value: "http://localhost:9944", label: "Local Frequency" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="">
                <Button type="primary" onClick={connectExtension}>
                  Connect to Polkadot.js Extension
                </Button>
              </Form.Item>
            </Form>
          )}
          {extensionConnected && (
            <>
              <Col span={12}>
                <Login onLogin={onLogin} selectedNetwork={selectedNetwork} handlesMap={handlesMap} />
              </Col>
              <Col span={12}>
                <CreateIdentity onLogin={onLogin} selectedNetwork={selectedNetwork} handlesMap={handlesMap} />
              </Col>
            </>
          )}
        </Row>
      </Spin>
    </div>
  );
};

export default LoginScreen;
