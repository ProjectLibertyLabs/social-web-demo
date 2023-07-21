import type { ICredential, DidResourceUri, KiltAddress } from '@kiltprotocol/sdk-js';
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { U8aLike } from "@polkadot/util/types";
import type { ReactNode } from 'react';


import {
  Did,
  DidUri,
} from '@kiltprotocol/sdk-js';

export type UserAccount = {
  address: string;
  expires: number;
  accessToken: string;
} & User;

export type User = {
  handle: string;
  dsnpId: string;
  profile?: {
    icon: string;
    name: string;
  };
};

export type HandlesMap = Map<
  string,
  { handle: string | null; account: InjectedAccountWithMeta }
>;

export enum FeedTypes {
  MY_FEED,
  DISCOVER,
  DISPLAY_ID_POSTS,
  MY_POSTS,
}

export type HexString = string;

export enum RelationshipStatus {
  FOLLOWING,
  NONE,
}

export interface Value {
  value: ReactNode;
  label: string;
  details?: string;
}

export type signWithDid = (plaintext: string, didUri?: DidUri) => Promise<{
  signature: string;
  didKeyUri: DidResourceUri;
}>;

export type getDidList = () => Promise<Array<{ did: DidUri; name?: string }>>;

export type  signCrossChain = (
    plaintext: string,
    blockNumber: number,
    values: Value[],
    didUri?: DidUri,
  ) => Promise<{ signed: string }>;

export type signExtrinsicWithDid = (
  extrinsic: HexString,
  submitter: KiltAddress,
  didUri?: DidUri,
) => Promise<{signed: HexString, didKeyUri: DidResourceUri;}>

export type SponsoredDidParams = {
  authorizedMsaId: number,
  schemaIds: number[],
}

export type AddProviderPayload = { authorizedMsaId?: any; schemaIds?: any, expiration?: any; };