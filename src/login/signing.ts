import {
  compactFromU8aLim,
  isFunction,
  u8aWrapBytes,
  u8aToHex,
} from "@polkadot/util";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { U8aLike } from "@polkadot/util/types";
import { TypeRegistry, Bytes } from "@polkadot/types";
import { AddProviderPayload, Value } from "../types";
import { getApi } from "./CreateIdentity";
import * as Kilt from '@kiltprotocol/sdk-js'

const Registry = new TypeRegistry();
Registry.register({
  ClaimHandle: {
    baseHandle: "Bytes",
    expiration: "u32",
  },
  AddProvider: {
    authorizedMsaId: "u64",
    schemaIds: "Vec<u16>",
    expiration: "u32",
  },
});

export async function buildCrossChainSignaturePayload(did: Kilt.DidUri, sponsoredDidParams: any) {
  // alice
  let submitterAccount: string = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
  let api = await getApi();
  const blockNumber = await api.query.system.number();
  const genesisHash = await api.query.system.blockHash(0);
  // const createSponsoredAccountWithDelegationCall = await api.tx.msa.createSponsoredMsaWithDid(sponsoredDidParams.providerId, sponsoredDidParams.schemas);
  // console.log("createSponsoredAccountWithDelegationCall", createSponsoredAccountWithDelegationCall.toHex());

  const encodedCall = "0x3c0e01000000000000001c0100020003000400050006000800"
  const decodedCall = api.createType('Call', encodedCall)

  const identityDetails = await api.query.dipConsumer.identityEntries(
    Kilt.Did.toChain(did)
  )

  const accountIdType = "AccountId32";
  const blockNumberType = "u32";
  const identityDetailsType = "u128";

  const signaturePayload = api
    .createType(
      `(Call, ${identityDetailsType}, ${accountIdType}, ${blockNumberType}, Hash)`,
      [
        decodedCall.toHex(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (identityDetails.toJSON() as any).details,
        submitterAccount,
        blockNumber,
        genesisHash,
      ]
    ).toHex()
    console.log("ENCODED CALL FOR SIGNING", signaturePayload);

  let payload = {
    view: [
            { value: `createSponsoredAccountWithDelegation(${sponsoredDidParams.providerId}, ${sponsoredDidParams.schemas})`, details: decodedCall.toHex(), label: 'Call',  },
            { details: "Consumer Root Nonce", value: (identityDetails.toJSON() as any).details, label: 'Consumer Root Nonce',  },
            { details: "Submitter", value: submitterAccount, label: 'Submitter',  },
            { details: "Provider Block Number", value: blockNumber.toHuman(), label: 'Provider Block Number',  },
            { details: "Consumer Genesis Hash", value: genesisHash.toHuman(), label: 'Consumer Genesis Hash',  },
          ],
    blockNumber: parseInt(blockNumber.toHex(), 16),
    signaturePayload, 
  }

  return payload;
}

export async function signPayloadWithDidExtension(
  address: string,
  sponsoredDidParams: any 
) {
  const walletAccount = await web3FromAddress(address);
  const signRaw = walletAccount.signer?.signRaw;
  let signed;
  if (signRaw && isFunction(signRaw)) {
    // const payloadWrappedToU8a = u8aWrapBytes(payload);
    try {
      const info = await window.kilt.sporran.getDidList();
      let payload = await buildCrossChainSignaturePayload(info[0].did, sponsoredDidParams);
      console.log("signingPayload", payload);
      console.log("did---information", info[0]);
      let result = await window.kilt.sporran.signCrossChain(
        payload.signaturePayload,
        payload.blockNumber,
        payload.view,
        info[0].did
      );

      return JSON.parse(result.signed);
    } catch (e) {
      console.log(e);
      return "ERROR!";
    }
  }
  return "Unknown error";
}


export async function signPayloadWithExtension(
  address: string,
  payload: U8aLike
) {
  const walletAccount = await web3FromAddress(address);
  const signRaw = walletAccount.signer?.signRaw;
  let signed;
  if (signRaw && isFunction(signRaw)) {
    const payloadWrappedToU8a = u8aWrapBytes(payload);
    try {
      signed = await signRaw({
        address,
        data: u8aToHex(payloadWrappedToU8a),
        type: "bytes",
      } as any);
      return signed?.signature;
    } catch (e) {
      console.log(e);
      return "ERROR!";
    }
  }
  return "Unknown error";
}

export const payloadHandle = (expiration: number, handle: string) => {
  const handleBytes = new Bytes(Registry, handle);
  const claimHandlePayload = Registry.createType("ClaimHandle", {
    baseHandle: handleBytes,
    expiration,
  });

  return claimHandlePayload;
};

export const payloadAddProvider = (
  expiration: number,
  providerId: string,
  schemaIds: number[]
) => {
  schemaIds.sort();
  const claimHandlePayload = Registry.createType("AddProvider", {
    authorizedMsaId: providerId,
    expiration,
    schemaIds,
  });

  return claimHandlePayload;
};

export const sponsoredDidParams = (
  providerId: string,
  schemaIds: number[]
) => {
  schemaIds.sort();

   return {
    authorizedMsaId: providerId,
    schemaIds,
  }
};
