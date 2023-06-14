import * as r from "@typoas/runtime";
export type ProviderResponse = {
  providerId: number;
  schemas: string;
};
export type ChallengeResponse = {
  challenge: string;
};
export type LoginRequest = {
  algo: "SR25519";
  encoding: "base16" | "base58";
  encodedValue: string;
  publicKey: string;
};
export type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  dsnpId: number;
};
export type CreateIdentityRequest = {
  algo: "SR25519";
  encoding: "base16" | "base58";
  encodedValue: string;
  publicKey: string;
  handle: string;
};
export type CreateIdentityResponse = {
  accessToken: string;
  expiresIn: number;
  displayHandle: string;
  dsnpId: number;
};
export type DelegateRequest = {
  algo: "SR25519";
  encoding: "base16" | "base58";
  encodedValue: string;
  publicKey: string;
};
export type DelegateResponse = {
  accessToken: string;
  expiresIn: number;
};
export type HandlesResponse = {
  publicKey: string;
  handle: string;
};
export type PaginatedBroadcast = {
  newestBlockNumber: number;
  oldestBlockNumber: number;
  posts: BroadcastExtended[];
};
export type BroadcastExtended = {
  fromId: number;
  contentHash: string;
  /**
   * JSON-encoded Activity Content Note
   */
  content: string;
  /**
   * Timestamp of the post
   */
  timestamp: string;
  /**
   * Array of ReplyExtended objects
   */
  replies?: ReplyExtended[];
};
export type ReplyExtended = {
  fromId: number;
  contentHash: string;
  /**
   * JSON-encoded Activity Content Note
   */
  content: string;
  /**
   * Timestamp of the post
   */
  timestamp: string;
  /**
   * Array of ReplyExtended objects
   */
  replies?: ReplyExtended[];
};
export type CreatePostRequest = {
  content: string;
};
export type EditPostRequest = {
  targetContentHash: string;
  targetAnnouncementType: number;
  content: string;
};
export type Profile = {
  fromId: number;
  contentHash: string;
  /**
   * JSON-encoded Activity Content Note
   */
  content: string;
  /**
   * Timestamp of the post
   */
  timestamp: string;
  displayHandle?: string;
};
export type EditProfileRequest = {
  content: string;
};
export type AuthMethods = {};
export function createContext(
  params?: r.CreateContextParams<AuthMethods>
): r.Context<AuthMethods> {
  return new r.Context<AuthMethods>({
    resolver: new r.RefResolver({}),
    serverConfiguration: new r.ServerConfiguration("http://localhost:5000", {}),
    authMethods: {},
    ...params,
  });
}
/**
 * Return a challenge for login
 */
export async function authChallenge(
  ctx: r.Context<AuthMethods>,
  params: {}
): Promise<ChallengeResponse> {
  const req = await ctx.createRequest({
    path: "/v1/auth/challenge",
    params,
    method: r.HttpMethod.GET,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "ChallengeResponse"]]] },
    },
  });
}
/**
 * Return the delegation and provider information
 */
export async function authProvider(
  ctx: r.Context<AuthMethods>,
  params: {}
): Promise<ProviderResponse> {
  const req = await ctx.createRequest({
    path: "/v1/auth/provider",
    params,
    method: r.HttpMethod.GET,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "ProviderResponse"]]] },
    },
  });
}
/**
 * Use a challenge to login
 */
export async function authLogin(
  ctx: r.Context<AuthMethods>,
  params: {},
  body: LoginRequest
): Promise<LoginResponse> {
  const req = await ctx.createRequest({
    path: "/v1/auth/login",
    params,
    method: r.HttpMethod.POST,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": { transforms: { date: [[[r.TransformType.REF, "LoginResponse"]]] } },
  });
}
/**
 * Logout and invalidate the access token
 */
export async function authLogout(
  ctx: r.Context<AuthMethods>,
  params: {}
): Promise<any> {
  const req = await ctx.createRequest({
    path: "/v1/auth/logout",
    params,
    method: r.HttpMethod.POST,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {});
}
/**
 * Creates a new DSNP Identity
 */
export async function authCreate(
  ctx: r.Context<AuthMethods>,
  params: {},
  body: CreateIdentityRequest
): Promise<CreateIdentityResponse> {
  const req = await ctx.createRequest({
    path: "/v1/auth/create",
    params,
    method: r.HttpMethod.POST,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "CreateIdentityResponse"]]] },
    },
  });
}
/**
 * Get handles for public keys
 */
export async function authHandles(
  ctx: r.Context<AuthMethods>,
  params: {},
  body: string[]
): Promise<HandlesResponse[]> {
  const req = await ctx.createRequest({
    path: "/v1/auth/handles",
    params,
    method: r.HttpMethod.POST,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: {
        date: [
          [[r.TransformType.LOOP], [r.TransformType.REF, "HandlesResponse"]],
        ],
      },
    },
  });
}
/**
 * Delegate to the provider with an existing DSNP Identity
 */
export async function authDelegate(
  ctx: r.Context<AuthMethods>,
  params: {},
  body: DelegateRequest
): Promise<DelegateResponse> {
  const req = await ctx.createRequest({
    path: "/v1/auth/delegate",
    params,
    method: r.HttpMethod.POST,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "DelegateResponse"]]] },
    },
  });
}
/**
 * Get recent posts from a user, paginated
 */
export async function getUserFeed(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
    startBlockNumber?: number;
    pageSize?: number;
  }
): Promise<PaginatedBroadcast> {
  const req = await ctx.createRequest({
    path: "/v1/content/{dsnpId}",
    params,
    method: r.HttpMethod.GET,
    queryParams: ["startBlockNumber", "pageSize"],
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "PaginatedBroadcast"]]] },
    },
  });
}
/**
 * Get the Feed for the current user, paginated
 */
export async function getFeed(
  ctx: r.Context<AuthMethods>,
  params: {
    startBlockNumber?: number;
    pageSize?: number;
  }
): Promise<PaginatedBroadcast> {
  const req = await ctx.createRequest({
    path: "/v1/content/feed",
    params,
    method: r.HttpMethod.GET,
    queryParams: ["startBlockNumber", "pageSize"],
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "PaginatedBroadcast"]]] },
    },
  });
}
/**
 * Create a new post
 */
export async function createBroadcast(
  ctx: r.Context<AuthMethods>,
  params: {},
  body: CreatePostRequest
): Promise<BroadcastExtended> {
  const req = await ctx.createRequest({
    path: "/v1/content/create",
    params,
    method: r.HttpMethod.POST,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "BroadcastExtended"]]] },
    },
  });
}
/**
 * Get details of a specific post
 */
export async function getContent(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
    contentHash: string;
  }
): Promise<BroadcastExtended> {
  const req = await ctx.createRequest({
    path: "/v1/content/{dsnpId}/{contentHash}",
    params,
    method: r.HttpMethod.GET,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "BroadcastExtended"]]] },
    },
  });
}
/**
 * Edit the content of a specific post
 */
export async function editContent(
  ctx: r.Context<AuthMethods>,
  params: {
    contentHash: string;
    type: string;
  },
  body: EditPostRequest
): Promise<BroadcastExtended> {
  const req = await ctx.createRequest({
    path: "/v1/content/{type}/{contentHash}",
    params,
    method: r.HttpMethod.PUT,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": {
      transforms: { date: [[[r.TransformType.REF, "BroadcastExtended"]]] },
    },
  });
}
/**
 * Get a list of users that a specific user follows
 */
export async function userFollowing(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
  }
): Promise<number[]> {
  const req = await ctx.createRequest({
    path: "/v1/graph/{dsnpId}/following",
    params,
    method: r.HttpMethod.GET,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {});
}
/**
 * Follow a user
 */
export async function graphFollow(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
  }
): Promise<any> {
  const req = await ctx.createRequest({
    path: "/v1/graph/{dsnpId}/follow",
    params,
    method: r.HttpMethod.POST,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {});
}
/**
 * Unfollow a user
 */
export async function graphUnfollow(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
  }
): Promise<any> {
  const req = await ctx.createRequest({
    path: "/v1/graph/{dsnpId}/unfollow",
    params,
    method: r.HttpMethod.POST,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {});
}
/**
 * Get profile information for a specific user
 */
export async function getProfile(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
  }
): Promise<Profile> {
  const req = await ctx.createRequest({
    path: "/v1/profiles/{dsnpId}",
    params,
    method: r.HttpMethod.GET,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": { transforms: { date: [[[r.TransformType.REF, "Profile"]]] } },
  });
}
/**
 * Create/Edit the profile information for a current user
 */
export async function createProfile(
  ctx: r.Context<AuthMethods>,
  params: {
    dsnpId: number;
  },
  body: EditProfileRequest
): Promise<Profile> {
  const req = await ctx.createRequest({
    path: "/v1/profiles/{dsnpId}",
    params,
    method: r.HttpMethod.PUT,
    body,
  });
  const res = await ctx.sendRequest(req);
  return ctx.handleResponse(res, {
    "200": { transforms: { date: [[[r.TransformType.REF, "Profile"]]] } },
  });
}
