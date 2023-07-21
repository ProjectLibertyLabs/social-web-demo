import React, { useState } from "react";
import { Button, Input, Select, Spin, Form } from "antd";
import Title from "antd/es/typography/Title";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { isFunction } from "@polkadot/util";
import { options } from "@frequency-chain/api-augment";
import * as Kilt from '@kiltprotocol/sdk-js'

import * as dsnpLink from "../dsnpLink";
import { HandlesMap, UserAccount, SponsoredDidParams } from "../types";
import {
  payloadAddProvider,
  sponsoredDidParams,
  payloadHandle,
  signPayloadWithExtension,
  signCreateSponsoredMsaWithDidPayload,
  signPayloadWithDidExtensionHandle
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

  const handleDidConnect = async () => {
    setIsLoading(true);

    const api = await getKiltApi();
    const didList = await window.kilt.sporran.getDidList();
    const didUri = didList[0].did;
    const didAddress = Kilt.Did.parse(didUri).address;
    
    const multiLocation = api.createType("XcmVersionedMultiLocation",  { V3: {parents: 1, interior: {X1: { Parachain: 5000 }}} })
    const asset = api.createType("XcmVersionedMultiAsset",  {V3: { Concrete: {parents: 0, interior: "Here"}, Fungible: 1000000 }});
    const weight = api.createType("SpWeightsWeightV2Weight", {refTime: 500000, proofSize: 0 });
    const commitIdentityExtrinsic= api.tx.dipProvider.commitIdentity(didAddress, multiLocation, asset, weight);
    const signed = await window.kilt.sporran.signExtrinsicWithDid(commitIdentityExtrinsic.toHex(), didAddress, didUri);
    console.log("signed", signed);

    const call = api.createType('Call', commitIdentityExtrinsic.method.toHex())
    console.log("submitDidCall", call.toHex());

    const queried = await api.query.did.did(didAddress);
    const document = Kilt.Did.documentFromChain(queried);
    const nextTxCounter = document.lastTxCounter.toNumber() + 1;
    
    // Kilt.Did.authorizeTx(didUri, commitIdentityExtrinsic, window.kilt.sporran.signWithDid, didAddress, {txCounter: nextTxCounter})
    // const submitDidCall = api.tx.did.submitDidCall({did: didAddress, txCounter: 3, call: call.toHex(), blockNumber: 1, submitter: didAddress }, { x25519: signed.signed})
    // console.log("submitDidCall", submitDidCall.method.toHex());

    setIsLoading(false);
  }

  const handleCreateIdentityWithDid = async () => {
    setIsLoading(true);
    // TODO: Validation
    const signingAccount = handlesMap.get(selectedAccount);
    if (handle && signingAccount) {
      try {
        // Ask wallet for a DID.
        const info = await window.kilt.sporran.getDidList();
        const someDidInfo = info[0];
        const parsedDidUri = Kilt.Did.parse(someDidInfo.did);
        const didAddress = parsedDidUri.address;

        providerInfo.schemas.sort();
        const sponsoredMsaWithParams = {
          authorizedMsaId: 1,
          schemaIds: providerInfo.schemas,
        };

        // Generate the delegation signature
        const sponsoredMsaWithDidSignature = await signCreateSponsoredMsaWithDidPayload(
          signingAccount.account.address,
          sponsoredMsaWithParams,
          someDidInfo.did,
        );

        console.log("sponsoredMsaWithDidSignature", sponsoredMsaWithDidSignature);

        // Generate the Handle Signature
        const blockNumber = await getBlockNumber(providerInfo.nodeUrl);
        const expiration = blockNumber + 50;
        const handlePayload = payloadHandle(expiration, handle);
        const didHandleSignature = await signPayloadWithDidExtensionHandle(signingAccount.account.address, handlePayload, someDidInfo.did);

        // Create identity
        const { expires, accessToken } = await dsnpLink.authDidCreate(
          getContext(),
          {},
          {
            algo: "SR25519",
            baseHandle: handle,
            encoding: "hex",
            identifier: didAddress,
            proof: {
              merkleLeaves: sponsoredMsaWithDidSignature[0],
              didSignature: sponsoredMsaWithDidSignature[1]
            },
            expiration,
            handleProof: {
              merkleLeaves: didHandleSignature[0],
              didSignature: didHandleSignature[1]
            }
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
              <Button key="1" type="primary" onClick={handleDidConnect}>
                Connect DID Identity
              </Button>
              <Button key="2" type="primary" style={{ margin: "5px" }} onClick={handleCreateIdentityWithDid}>
                Create with DID Identity
              </Button>
              <Button key="3" type="primary" onClick={handleCreateIdentity}>
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
const kiltUri = "ws://localhost:9940";

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

let _kiltSingletonApi: null | Promise<ApiPromise> = null;
export const getKiltApi = async (): Promise<ApiPromise> => {
  if (_kiltSingletonApi !== null) {
    return _kiltSingletonApi;
  }

  if (!providerUri) {
    throw new Error("FREQUENCY_NODE env variable is required");
  }

  await Kilt.connect(kiltUri);
  _kiltSingletonApi = Promise.resolve(Kilt.ConfigService.get('api'));

  return _kiltSingletonApi;
};
