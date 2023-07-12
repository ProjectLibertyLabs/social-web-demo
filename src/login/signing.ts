import { compactFromU8aLim, isFunction, u8aWrapBytes, u8aToHex } from "@polkadot/util";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { U8aLike } from "@polkadot/util/types";
import { TypeRegistry, Bytes } from "@polkadot/types";

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
