import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { ProviderResponse } from "./dsnpLink";

export type Network = ProviderResponse["network"];

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
  LIVE_FEED,
}

export type HexString = string;

export enum RelationshipStatus {
  FOLLOWING,
  NONE,
}
