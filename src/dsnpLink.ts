import * as r from '@typoas/runtime';
export type ProviderResponse = {
    providerId: number;
    schemas: number[];
};
export type ChallengeResponse = {
    challenge: string;
};
export type LoginRequest = {
    algo: 'SR25519';
    encoding: 'base16' | 'base58';
    encodedValue: string;
    publicKey: string;
};
export type LoginResponse = {
    accessToken: string;
    expiresIn: number;
    dsnpId: number;
};
export type CreateIdentityRequest = {
    addProviderSignature: string;
    algo: 'SR25519';
    baseHandle: string;
    encoding: 'base16' | 'base58';
    expiration: number;
    handleSignature: string;
    publicKey: string;
};
export type CreateIdentityResponse = {
    accessToken: string;
    expiresIn: number;
    displayHandle: string;
    dsnpId: number;
};
export type DelegateRequest = {
    algo: 'SR25519';
    encoding: 'base16' | 'base58';
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
    images?: string[];
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
export function createContext<FetcherData>(params?: r.CreateContextParams<AuthMethods, FetcherData>): r.Context<AuthMethods, FetcherData> { return new r.Context<AuthMethods, FetcherData>({
    serverConfiguration: new r.ServerConfiguration('http://localhost:5000', {}),
    authMethods: {},
    ...params
}); }
/**
 * Return a challenge for login
 */
export async function authChallenge<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<ChallengeResponse> {
    const req = await ctx.createRequest({
        path: '/v1/auth/challenge',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Return the delegation and provider information
 */
export async function authProvider<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<ProviderResponse> {
    const req = await ctx.createRequest({
        path: '/v1/auth/provider',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Use a challenge to login
 */
export async function authLogin<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: LoginRequest, opts?: FetcherData): Promise<LoginResponse> {
    const req = await ctx.createRequest({
        path: '/v1/auth/login',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Logout and invalidate the access token
 */
export async function authLogout<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/v1/auth/logout',
        params,
        method: r.HttpMethod.POST
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Creates a new DSNP Identity
 */
export async function authCreate<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: CreateIdentityRequest, opts?: FetcherData): Promise<CreateIdentityResponse> {
    const req = await ctx.createRequest({
        path: '/v1/auth/create',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get handles for public keys
 */
export async function authHandles<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: string[], opts?: FetcherData): Promise<HandlesResponse[]> {
    const req = await ctx.createRequest({
        path: '/v1/auth/handles',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Delegate to the provider with an existing DSNP Identity
 */
export async function authDelegate<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: DelegateRequest, opts?: FetcherData): Promise<DelegateResponse> {
    const req = await ctx.createRequest({
        path: '/v1/auth/delegate',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get recent posts from a user, paginated
 */
export async function getUserFeed<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
    startBlockNumber?: number;
    pageSize?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/v1/content/{dsnpId}',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "startBlockNumber",
            "pageSize"
        ]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the Feed for the current user, paginated
 */
export async function getFeed<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    startBlockNumber?: number;
    pageSize?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/v1/content/feed',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "startBlockNumber",
            "pageSize"
        ]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Create a new post
 */
export async function createBroadcast<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: any, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/v1/content/create',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get details of a specific post
 */
export async function getContent<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
    contentHash: string;
}, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/v1/content/{dsnpId}/{contentHash}',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Edit the content of a specific post
 */
export async function editContent<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    contentHash: string;
    type: string;
}, body: EditPostRequest, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/v1/content/{type}/{contentHash}',
        params,
        method: r.HttpMethod.PUT,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get a list of users that a specific user follows
 */
export async function userFollowing<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
}, opts?: FetcherData): Promise<number[]> {
    const req = await ctx.createRequest({
        path: '/v1/graph/{dsnpId}/following',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Follow a user
 */
export async function graphFollow<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/v1/graph/{dsnpId}/follow',
        params,
        method: r.HttpMethod.POST
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Unfollow a user
 */
export async function graphUnfollow<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/v1/graph/{dsnpId}/unfollow',
        params,
        method: r.HttpMethod.POST
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get profile information for a specific user
 */
export async function getProfile<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
}, opts?: FetcherData): Promise<Profile> {
    const req = await ctx.createRequest({
        path: '/v1/profiles/{dsnpId}',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Create/Edit the profile information for a current user
 */
export async function createProfile<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: number;
}, body: EditProfileRequest, opts?: FetcherData): Promise<Profile> {
    const req = await ctx.createRequest({
        path: '/v1/profiles/{dsnpId}',
        params,
        method: r.HttpMethod.PUT,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
