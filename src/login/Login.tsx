import React, { useState } from "react";
import { Button, Select, Spin, Form } from "antd";
import Title from "antd/es/typography/Title";

import * as dsnpLink from "../dsnpLink";
import { HandlesMap, UserAccount } from "../types";
import { signPayloadWithExtension } from "./signing";
import styles from "./Login.module.css";
import { getContext } from "../service/AuthService";

interface LoginProps {
  handlesMap: HandlesMap;
  onLogin: (account: UserAccount, network: string) => void;
  selectedNetwork: string;
}

const Login = ({
  onLogin,
  handlesMap,
  selectedNetwork,
}: LoginProps): JSX.Element => {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedAccount) return;
    const handle = handlesMap.get(selectedAccount)?.handle;
    if (!handle) return;
    setIsLoading(true);

    try {
      const dsnpLinkCtx = getContext();
      const { challenge } = await dsnpLink.authChallenge(dsnpLinkCtx, {});

      const signedChallenge = await signPayloadWithExtension(
        selectedAccount,
        challenge
      );

      if (!signedChallenge.startsWith("0x")) {
        throw Error("Unable to sign: " + signedChallenge);
      }

      const { accessToken, expires, dsnpId } = await dsnpLink.authLogin(
        dsnpLinkCtx,
        {},
        {
          algo: "SR25519",
          encoding: "base58",
          encodedValue: signedChallenge,
          publicKey: selectedAccount,
          challenge,
        }
      );
      onLogin(
        {
          address: selectedAccount,
          handle,
          accessToken,
          expires,
          dsnpId,
        },
        selectedNetwork
      );
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handlesValues = [...handlesMap.values()].filter(
    ({ handle }) => !!handle
  );

  return (
    <div className={styles.root}>
      <Title level={2}>Create Social Web Identity</Title>
      <div>
        <Form layout="vertical" size="large">
          <Spin tip="Loading" size="large" spinning={isLoading}>
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
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default Login;
