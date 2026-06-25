import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * Creates a production-configured QueryClient.
 *
 * Key decisions:
 * - staleTime 60s: prevents unnecessary refetches while keeping data reasonably fresh
 * - gcTime 5min: keeps inactive queries in memory for fast back-navigation
 * - retry 1: one retry is enough for transient network errors
 * - refetchOnWindowFocus false: prevents jarring refetches during presentations
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns a singleton QueryClient.
 * - Server: always creates a fresh client (prevents cross-request state pollution)
 * - Browser: reuses a single client across the app lifecycle
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
