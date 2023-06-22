import React, { useState } from "react";
import { Button, Input, Select, Spin, Form } from "antd";
import Title from "antd/es/typography/Title";

import * as dsnpLink from "../dsnpLink";
import { HandlesMap, UserAccount } from "../types";
import { payloadAddProvider, payloadHandle, signPayloadWithExtension } from "./signing";
import styles from "./CreateIdentity.module.css";
import { getBlockNumber } from "../service/FrequencyApiService";

const dsnpLinkCtx = dsnpLink.createContext();

interface CreateIdentityProps {
  handlesMap: HandlesMap;
  onLogin: (account: UserAccount, network: string) => void;
  selectedNetwork: string;
}

const CreateIdentity = ({
  onLogin,
  handlesMap,
  selectedNetwork,
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
        // Get the current block number
        const blockNumber = await getBlockNumber(selectedNetwork);
        const expiration = blockNumber + 50;
        // Get provider information
        const providerInfo = await dsnpLink.authProvider(dsnpLinkCtx, {});
        // Generate the Handle Signature
        const handlePayload = payloadHandle(blockNumber, handle);
        const handleSignature = await signPayloadWithExtension(
          signingAccount.account.address,
          handlePayload.toU8a()
        );

        if (!handleSignature.startsWith("0x")) throw Error("Unable to sign: " + handleSignature);

        // Generate the delegation signature
        const addProviderPayload = payloadAddProvider(blockNumber, providerInfo.providerId, providerInfo.schemas);
        const addProviderSignature = await signPayloadWithExtension(
          signingAccount.account.address,
          addProviderPayload.toU8a()
        );

        if (!addProviderSignature.startsWith("0x")) throw Error("Unable to sign: " + handleSignature);

        // Create identity
        const { expiresIn, accessToken, displayHandle, dsnpId } =
          await dsnpLink.authCreate(
            dsnpLinkCtx,
            {},
            {
              algo: "SR25519",
              encoding: "base58",
              expiration,
              baseHandle: handle,
              publicKey: signingAccount.account.address,
              addProviderSignature,
              handleSignature,
            }
          );

        onLogin({
          address: selectedAccount,
          handle: displayHandle,
          expiresIn,
          accessToken,
          dsnpId,
        }, selectedNetwork);
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
    <div className={styles.root}>
      <Title level={2}>Create Social Web Identity</Title>
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
