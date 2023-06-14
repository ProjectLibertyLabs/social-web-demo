import { isFunction, u8aToHex, hexToU8a, u8aWrapBytes } from "@polkadot/util";
import { web3FromSource } from "@polkadot/extension-dapp";

import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { RawSigningPayload } from "../types";

const wrapToU8a = (payload: RawSigningPayload) => {
  return u8aWrapBytes(payload as any);
};

export async function signPayloadWithExtension(
  signingAccount: InjectedAccountWithMeta,
  payload: RawSigningPayload
) {
  const injector = await web3FromSource(signingAccount.meta.source);
  const signer = injector?.signer;
  const signRaw = signer?.signRaw;
  let signed;
  if (signer && isFunction(signRaw)) {
    const payloadWrappedToU8a = wrapToU8a(payload);
    try {
      signed = await signRaw({
        address: signingAccount.address,
        data: payloadWrappedToU8a,
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
