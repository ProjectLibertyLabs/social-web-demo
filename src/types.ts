import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { U8aLike } from "@polkadot/util/types";

export type UserAccount = {
  address: string;
  expiresIn: number;
  accessToken: string;
} & User;

export type User = {
  handle: string;
  dsnpId: number;
  profile?: {
    icon: string;
    name: string;
  };
};

export type HandlesMap = Map<
  string,
  { handle: string | null; account: InjectedAccountWithMeta }
>;

export type RawSigningPayload = { toU8a: () => U8aLike };

export enum FeedTypes {
  MY_FEED,
  DISCOVER,
  DISPLAY_ID_POSTS,
}

export type HexString = string;
