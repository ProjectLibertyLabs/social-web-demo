import { blake2AsU8a, randomAsU8a } from "@polkadot/util-crypto";
import { base58btc } from "multiformats/bases/base58";

export const makeInteractionId = (dsnpId: string, nonceBytes: Uint8Array) => {
  return makeInteractionIdAndNonce(dsnpId, nonceBytes).interactionId;
};

export const makeInteractionIdAndNonce = (
  dsnpId: string,
  nonceBytes: Uint8Array = randomAsU8a(24),
) => {
  // FIXME make this a bitwise uint64 encoding rather than a text encoding
  const dsnpIdBytes = new TextEncoder().encode(dsnpId);

  const interactionHash = blake2AsU8a(
    new Uint8Array([...dsnpIdBytes, ...nonceBytes]),
  );

  // [160,228,2] = blake2-256 multicodec value
  return {
    interactionId: base58btc.encode(
      new Uint8Array([160, 228, 2, ...interactionHash]),
    ),
    nonce: base58btc.encode(nonceBytes),
  };
};

export const verifyInteractionId = (
  interactionId: string,
  dsnpId: string,
  nonceMultibase: string,
) => {
  const nonce = base58btc.decode(nonceMultibase);
  const checkInteractionId = makeInteractionId(dsnpId, nonce);
  return checkInteractionId === interactionId;
};
