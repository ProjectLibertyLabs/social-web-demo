import React, { useState } from "react";
import { Button, Input, Select, Spin, Form } from "antd";
import Title from "antd/es/typography/Title";

import * as dsnpLink from "../dsnpLink";
import { HandlesMap, UserAccount } from "../types";
import {
  payloadAddProvider,
  payloadHandle,
  signPayloadWithExtension,
} from "./signing";
import styles from "./CreateIdentity.module.css";
import { getBlockNumber } from "../service/FrequencyApiService";
import { getContext, setAccessToken } from "../service/AuthService";

interface CreateIdentityProps {
  handlesMap: HandlesMap;
  onLogin: (
    account: UserAccount,
    providerInfo: dsnpLink.ProviderResponse
  ) => void;
  providerInfo: dsnpLink.ProviderResponse;
}

const CreateIdentity = ({
  onLogin,
  handlesMap,
  providerInfo,
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
        const blockNumber = await getBlockNumber(providerInfo.nodeUrl);
        const expiration = blockNumber + 50;
        // Generate the Handle Signature
        const handlePayload = payloadHandle(expiration, handle);
        const handleSignature = await signPayloadWithExtension(
          signingAccount.account.address,
          handlePayload.toU8a()
        );

        if (!handleSignature.startsWith("0x"))
          throw Error("Unable to sign: " + handleSignature);

        // Generate the delegation signature
        const addProviderPayload = payloadAddProvider(
          expiration,
          providerInfo.providerId,
          providerInfo.schemas
        );
        const addProviderSignature = await signPayloadWithExtension(
          signingAccount.account.address,
          addProviderPayload.toU8a()
        );

        if (!addProviderSignature.startsWith("0x"))
          throw Error("Unable to sign: " + handleSignature);

        // Create identity
        const { expires, accessToken } = await dsnpLink.authCreate(
          getContext(),
          {},
          {
            algo: "SR25519",
            encoding: "hex",
            expiration,
            baseHandle: handle,
            publicKey: signingAccount.account.address,
            addProviderSignature,
            handleSignature,
          }
        );

        setAccessToken(accessToken, expires);
        const dsnpLinkCtx = getContext();

        // We have to poll for the account creation
        let accountResp: dsnpLink.AuthAccountResponse | null = null;
        const getDsnpAndHandle = async (
          timeout: number
        ): Promise<null | dsnpLink.AuthAccountResponse> =>
          new Promise((resolve) => {
            setTimeout(async () => {
              const resp = await dsnpLink.authAccount(dsnpLinkCtx, {});
              // Handle the 202 response
              if (resp.size === 0) {
                resolve(null);
              } else {
                resolve(resp);
              }
            }, timeout);
          });
        accountResp = await getDsnpAndHandle(0);
        let tries = 1;
        while (accountResp === null && tries < 10) {
          console.log(
            "Waiting another 3 seconds before getting the account again..."
          );
          accountResp = await getDsnpAndHandle(3_000);
          tries++;
        }
        if (accountResp === null) {
          throw new Error("Account Creation timed out");
        }

        onLogin(
          {
            address: selectedAccount,
            handle: accountResp.displayHandle || "Anonymous",
            expires,
            accessToken,
            dsnpId: accountResp.dsnpId,
          },
          providerInfo
        );
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
function getApi() {
  throw new Error("Function not implemented.");
}
