import { signWithDid, getDidList, signCrossChain, signExtrinsicWithDid } from './types';

export {};
declare global {
  interface Window {
    kilt: Record<
      string,
      {
        name?: string;
        signWithDid: signWithDid;
        getDidList: getDidList;
        signCrossChain: signCrossChain;
        signExtrinsicWithDid: signExtrinsicWithDid;
      }
    >;
  }
}
