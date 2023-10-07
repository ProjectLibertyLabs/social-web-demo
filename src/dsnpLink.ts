import * as r from '@typoas/runtime';
export type ProviderResponse = {
    nodeUrl: string;
    /**
     * IPFS Path Style Gateway base URI
     */
    ipfsGateway?: string;
    providerId: string;
    schemas: number[];
    network: 'local' | 'testnet' | 'mainnet';
};
export type ChallengeResponse = {
    challenge: string;
};
export type LoginRequest = {
    algo: 'SR25519';
    encoding: 'hex';
    encodedValue: string;
    publicKey: string;
    challenge: string;
};
export type LoginResponse = {
    accessToken: string;
    expires: number;
    dsnpId: string;
};
export type CreateIdentityRequest = {
    addProviderSignature: string;
    algo: 'SR25519';
    baseHandle: string;
    encoding: 'hex';
    expiration: number;
    handleSignature: string;
    publicKey: string;
};
export type CreateIdentityResponse = {
    accessToken: string;
    expires: number;
};
export type AuthAccountResponse = {
    dsnpId: string;
    displayHandle?: string;
};
export type DelegateRequest = {
    algo: 'SR25519';
    encoding: 'hex';
    encodedValue: string;
    publicKey: string;
};
export type DelegateResponse = {
    accessToken: string;
    expires: number;
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
    fromId: string;
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
    fromId: string;
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
    inReplyTo?: string;
    images?: string[];
};
export type EditPostRequest = {
    targetContentHash: string;
    targetAnnouncementType: number;
    content: string;
};
export type Profile = {
    fromId: string;
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
export type InteractionRequest = {
    attributeSetType: string;
    interactionId: string;
    href: string;
    reference: any;
};
/**
 * Either a string, or an array containing strings and objects with string values
 */
export type JsonLdContext = string | (string | {
    [key: string]: string;
})[];
export type VerifiableCredentialWithoutProof = {
    '@context': JsonLdContext;
    type: string[];
    issuer: string;
    issuanceDate: string;
    credentialSchema: {
        type: 'VerifiableCredentialSchema2023';
        /**
         * URL of schema verifiable credential
         */
        id: string;
    };
    credentialSubject: {
        interactionId: string;
        href?: string;
        reference: any;
    };
};
export type VerifiableCredentialWithEd25519Proof = VerifiableCredentialWithoutProof;
export type InteractionTicket = VerifiableCredentialWithoutProof;
export type InteractionResponse = {
    attributeSetType: string;
    ticket: InteractionTicket;
};
export type AuthMethods = {
    tokenAuth?: r.HttpBearerSecurityAuthentication;
};
export function configureAuth(params?: r.CreateContextParams<AuthMethods>["authProviders"]): AuthMethods {
    return { tokenAuth: params?.tokenAuth && new r.HttpBearerSecurityAuthentication(params.tokenAuth) };
}
export function createContext<FetcherData>(params?: r.CreateContextParams<AuthMethods, FetcherData>): r.Context<AuthMethods, FetcherData> { return new r.Context<AuthMethods, FetcherData>({
    serverConfiguration: new r.ServerConfiguration('http://localhost:5005', {}),
    authMethods: configureAuth(params?.authProviders),
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
 * Returns 204 No Content if the caller's token is valid, 401 Unauthorized if not
 */
export async function authAssert<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/v1/auth/assert',
        params,
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
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
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
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
 * For polling to get the created account as authCreate can take time
 */
export async function authAccount<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<AuthAccountResponse | any> {
    const req = await ctx.createRequest({
        path: '/v1/auth/account',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
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
    dsnpId: string;
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/v1/content/{dsnpId}',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber"
        ],
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the Feed for the current user, paginated
 */
export async function getFeed<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/v1/content/feed',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber"
        ],
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the Discovery Feed for the current user, paginated
 */
export async function getDiscover<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/v1/content/discover',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber"
        ],
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the feed of posts with interaction tags of a given attribute set type and URL, paginated.
 */
export async function getInteractionsFeed<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
    rel?: string;
    href?: string;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/v1/content/interactions',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber",
            "rel",
            "href"
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
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get details of a specific post
 */
export async function getContent<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
    contentHash: string;
}, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/v1/content/{dsnpId}/{contentHash}',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
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
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get a list of users that a specific user follows
 */
export async function userFollowing<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
}, opts?: FetcherData): Promise<string[]> {
    const req = await ctx.createRequest({
        path: '/v1/graph/{dsnpId}/following',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Follow a user
 */
export async function graphFollow<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/v1/graph/{dsnpId}/follow',
        params,
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Unfollow a user
 */
export async function graphUnfollow<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/v1/graph/{dsnpId}/unfollow',
        params,
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get profile information for a specific user
 */
export async function getProfile<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
}, opts?: FetcherData): Promise<Profile> {
    const req = await ctx.createRequest({
        path: '/v1/profiles/{dsnpId}',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Create/Edit the profile information for a current user
 */
export async function createProfile<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
}, body: EditProfileRequest, opts?: FetcherData): Promise<Profile> {
    const req = await ctx.createRequest({
        path: '/v1/profiles/{dsnpId}',
        params,
        method: r.HttpMethod.PUT,
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Request attestation for a pseudonymous interaction claim
 */
export async function submitInteraction<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: InteractionRequest, opts?: FetcherData): Promise<InteractionResponse> {
    const req = await ctx.createRequest({
        path: '/v1/interactions',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
