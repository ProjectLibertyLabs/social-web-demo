import React, { useState } from "react";
import { Button, Input, Select, Spin, Form } from "antd";
import Title from "antd/es/typography/Title";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@frequency-chain/api-augment";

import * as dsnpLink from "../dsnpLink";
import { HandlesMap, UserAccount } from "../types";
import {
  payloadAddProvider,
  sponsoredDidParams,
  payloadHandle,
  signPayloadWithExtension,
  signPayloadWithDidExtension
} from "./signing";
import styles from "./CreateIdentity.module.css";
import { getBlockNumber } from "../service/FrequencyApiService";
import { getContext, setAccessToken } from "../service/AuthService";

interface CreateIdentityProps {
  handlesMap: HandlesMap;
  onLogin: (account: UserAccount, network: string) => void;
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
  const sporranWindow = window.kilt || {};
  
  // 0x480158fa76538b3f3ffb8536ae8a4e77d77440064bb5d40c2cdbb5ac58dda9d9d7fd0834800600204b04656e6464790000947f040cfcdc16b3384bd72777296b6384ac9a6c64fd9b49ecb6dcb21f683391b531b701000008002cfcdc16b3384bd72777296b6384ac9a6c64fd9b49ecb6dcb21f683391b531b701000001a8dacfa33d9cd0612382d536e6bb6f4ccb3e1767b2eefbdbcb9eb01819dac00d010000000114656e6464791f010000011473259b1cb43ab92c0cd4d0490bd3369e4ba468fccb047cf132baa57746ab79592c8b7c7e722d9464a0209302879b58a3c58ae2eecd9c9fca78c720e3c80b87230300003c0e01000000000000001c010002000300040005000600080023030000 
  const handleDidCreateIdentity = async () => {
    setIsLoading(true);
    // TODO: Validation
    const signingAccount = handlesMap.get(selectedAccount);
    if (handle && signingAccount) {
      try {
        // Get the current block number
        const blockNumber = await getBlockNumber(providerInfo.nodeUrl);
        const expiration = blockNumber + 50;
        // Generate the delegation signature
        providerInfo.schemas.sort();

        const sponsoredDidParams = {
            authorizedMsaId: 1,
            schemaIds: providerInfo.schemas,
          };

        const didSponsoredSignature = await signPayloadWithDidExtension(
          signingAccount.account.address,
          sponsoredDidParams
        );
  
        
        // Generate the Handle Signature
        const handlePayload = payloadHandle(expiration, handle);

        const handleSignature = await signPayloadWithExtension(
          signingAccount.account.address,
          handlePayload.toU8a()
        );

        if (!handleSignature.startsWith("0x"))
          throw Error("Unable to sign: " + handleSignature);
        // Create identity
        const { expires, accessToken } = await dsnpLink.authDidCreate(
          getContext(),
          {},
          {
            algo: "SR25519",
            baseHandle: handle,
            encoding: "hex",
            identifier: "4rjTsKHoYsTF2SP6Ltq5EnpQG3X6Fg5954RRdhwuFZvU2P9u",
            proof: {
              merkleLeaves: didSponsoredSignature[0],
              didSignature: didSponsoredSignature[1]
            },
            expiration,
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
          providerInfo.nodeUrl
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
          providerInfo.nodeUrl
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
              <Button type="primary" onClick={handleDidCreateIdentity}>
                Create with DID Identity
              </Button>
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

let _singletonApi: null | Promise<ApiPromise> = null;
const providerUri = "ws://localhost:9960";

export const getApi = (): Promise<ApiPromise> => {
  if (_singletonApi !== null) {
    return _singletonApi;
  }

  if (!providerUri) {
    throw new Error("FREQUENCY_NODE env variable is required");
  }

  const provider = new WsProvider(providerUri);
  _singletonApi = ApiPromise.create({ provider: provider, throwOnConnect: true, ...options });

  return _singletonApi;
};
