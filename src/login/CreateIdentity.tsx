import React, { useState } from "react";
import { Button, Input, Select, Spin, Form } from "antd";

import * as dsnpLink from "../dsnpLink";
import { HandlesMap, UserAccount } from "../types";
import { signPayloadWithExtension } from "./signing";

const dsnpLinkCtx = dsnpLink.createContext();

interface CreateIdentityProps {
  handlesMap: HandlesMap;
  onLogin: (account: UserAccount) => void;
}

const CreateIdentity = ({
  onLogin,
  handlesMap,
}: CreateIdentityProps): JSX.Element => {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountChange = (value: string) => {
    setSelectedAccount(value);
  };

  const handleHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Validation
    setHandle(event.target.value);
  };

  const handleCreateIdentity = async () => {
    setIsLoading(true);
    // TODO: Validation
    const signingAccount = handlesMap.get(selectedAccount);
    if (handle && signingAccount) {
      try {
        // Get provider information

        const providerInfo = await dsnpLink.authProvider(dsnpLinkCtx, {});

        const signature = await signPayloadWithExtension(
          signingAccount.account,
          "" as any
        );

        // Create identity
        const { expiresIn, accessToken, displayHandle, dsnpId } =
          await dsnpLink.authCreate(
            dsnpLinkCtx,
            {},
            {
              algo: "SR25519",
              encoding: "base16",
              encodedValue: "",
              publicKey: "",
              handle: "",
            }
          );

        onLogin({
          address: selectedAccount,
          handle: displayHandle,
          expiresIn,
          accessToken,
          dsnpId,
        });
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    } else {
      // Handle errors
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Social Web Identity</h2>
      <div>
        <Form layout="vertical" size="large">
          <Spin tip="Loading" size="large" spinning={isLoading}>
            <Form.Item label="Handle">
              <Input
                id="handle"
                value={handle}
                onChange={handleHandleChange}
                placeholder="Enter Handle"
              />
            </Form.Item>
            <Form.Item label="Account">
              <Select<string>
                onChange={setSelectedAccount}
                placeholder="Select Account"
                options={[...handlesMap.values()].map(
                  ({ account: { address, meta } }) => ({
                    value: address,
                    label: meta.name
                      ? `${meta.name} (${address})`
                      : `${address}`,
                  })
                )}
              />
            </Form.Item>
            <Form.Item label="">
              <Button type="primary" onClick={handleCreateIdentity}>
                Create Identity
              </Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default CreateIdentity;
