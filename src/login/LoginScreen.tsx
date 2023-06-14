import React, { useState } from "react";
import { Button, Select, Spin, Row, Col, Form } from "antd";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import MissingWallet from "./MissingWallet";
import * as dsnpLink from "../dsnpLink";
import CreateIdentity from "./CreateIdentity";
import { HandlesMap, UserAccount } from "../types";

const dsnpLinkCtx = dsnpLink.createContext();

interface LoginScreenProps {
  onLogin: (account: UserAccount) => void;
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
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
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

  const handleLogin = async () => {
    if (!selectedAccount) return;
    const handle = handlesMap.get(selectedAccount)?.handle;
    if (!handle) return;
    setIsLoading(true);

    const { challenge } = await dsnpLink.authChallenge(dsnpLinkCtx, {});

    const { accessToken, expiresIn, dsnpId } = await dsnpLink.authLogin(
      dsnpLinkCtx,
      {},
      {
        algo: "SR25519",
        encoding: "base16",
        encodedValue: "0x",
        publicKey: "0x",
      }
    );
    onLogin({
      address: selectedAccount,
      handle,
      accessToken,
      expiresIn,
      dsnpId,
    });
  };

  const handlesValues = [...handlesMap.values()].filter(
    ({ handle }) => !!handle
  );

  return (
    <div>
      <Spin tip="Loading" size="large" spinning={isLoading}>
        {!hasWalletExtension && !isLoading && <MissingWallet />}
        {hasWalletExtension && !extensionConnected && (
          <Form wrapperCol={{ span: 12 }} layout="vertical" size="large">
            <Form.Item label="Select Network">
              <Select<string>
                onChange={handleNetworkChange}
                placeholder="Select Network"
                defaultValue="local"
                options={[
                  { value: "mainnet", label: "Frequency Mainnet" },
                  { value: "testnet", label: "Frequency Testnet" },
                  { value: "local", label: "Local Frequency" },
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
            <Row>
              <Col span={12}>
                <Form layout="vertical" size="large">
                  <Form.Item label="">
                    <Select<string>
                      disabled={handlesValues.length === 0}
                      onChange={setSelectedAccount}
                      placeholder="Select Account"
                      options={handlesValues.map(({ account, handle }) => ({
                        value: account.address,
                        label: handle,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label="">
                    <Button type="primary" onClick={handleLogin}>
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={12}>
                <CreateIdentity onLogin={onLogin} handlesMap={handlesMap} />
              </Col>
            </Row>
          </>
        )}
      </Spin>
    </div>
  );
};

export default LoginScreen;
