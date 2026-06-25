"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCcw,
  Trash2,
  Zap,
  Clock,
  Database,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  Timer,
  RotateCcw,
} from "lucide-react";

import { getUsersAction } from "@/actions/users/get-users";
import { getUserAction } from "@/actions/users/get-user";
import { deleteUserAction } from "@/actions/users/delete-user";
import { userKeys } from "@/lib/query-keys";
import type { User } from "@/features/users/types";
import type { ApiResponse } from "@/types";

// ─── Status Badge Helper ───────────────────────────────────
function QueryStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    error: "bg-red-500/15 text-red-700 dark:text-red-400",
    success: "bg-green-500/15 text-green-700 dark:text-green-400",
  };

  return (
    <Badge className={`border-0 ${variants[status] ?? ""}`}>
      {status}
    </Badge>
  );
}

function FetchStatusBadge({ fetchStatus }: { fetchStatus: string }) {
  const variants: Record<string, string> = {
    fetching: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    paused: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
    idle: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  };

  return (
    <Badge variant="outline" className={`border-0 ${variants[fetchStatus] ?? ""}`}>
      fetch: {fetchStatus}
    </Badge>
  );
}

// ─── 1. Query Status Demo ──────────────────────────────────
function QueryStatusDemo() {
  const [enabled, setEnabled] = useState(false);

  const query = useQuery({
    queryKey: ["playground", "status-demo"],
    queryFn: () => getUsersAction({ page: 1, limit: 3 }),
    enabled,
    retry: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4" />
          Query Lifecycle
        </CardTitle>
        <CardDescription>
          Observe how a query transitions through states: idle → pending → success/error
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <QueryStatusBadge status={query.status} />
          <FetchStatusBadge fetchStatus={query.fetchStatus} />
          {query.isStale && (
            <Badge variant="outline" className="border-0 bg-orange-500/15 text-orange-700 dark:text-orange-400">
              stale
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => setEnabled(true)} disabled={enabled}>
            <Zap className="mr-2 h-3.5 w-3.5" />
            Enable Query
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => query.refetch()}
            disabled={!enabled}
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
            Refetch
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEnabled(false)}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        {query.data && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Fetched {query.data.data?.length ?? 0} users
            </p>
            <pre className="text-xs overflow-auto max-h-32">
              {JSON.stringify(
                query.data.data?.map((u) => ({ id: u.id, name: u.name })),
                null,
                2
              )}
            </pre>
          </div>
        )}

        {query.error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            Error: {(query.error as Error).message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 2. Cache Demo ─────────────────────────────────────────
function CacheDemo() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("1");
  const userIds = ["1", "2", "3", "4", "5"];

  const query = useQuery({
    queryKey: ["playground", "cache-demo", userId],
    queryFn: () => getUserAction(userId),
    staleTime: 10_000, // 10 seconds
    gcTime: 30_000, // 30 seconds
  });

  const cachedQueries = userIds.map((id) => {
    const state = queryClient.getQueryState(["playground", "cache-demo", id]);
    return {
      id,
      isCached: !!state,
      isFresh: state ? Date.now() - state.dataUpdatedAt < 10_000 : false,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="h-4 w-4" />
          Cache Visualization
        </CardTitle>
        <CardDescription>
          Switch between users to see caching in action. staleTime: 10s, gcTime: 30s
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {userIds.map((id) => (
            <Button
              key={id}
              size="sm"
              variant={userId === id ? "default" : "outline"}
              onClick={() => setUserId(id)}
            >
              User {id}
            </Button>
          ))}
        </div>

        {/* Cache status grid */}
        <div className="grid grid-cols-5 gap-2">
          {cachedQueries.map((cq) => (
            <div
              key={cq.id}
              className={`rounded-lg border p-2 text-center text-xs ${
                cq.isFresh
                  ? "border-green-500/30 bg-green-500/5"
                  : cq.isCached
                    ? "border-orange-500/30 bg-orange-500/5"
                    : "border-muted"
              }`}
            >
              <div className="font-medium">User {cq.id}</div>
              <div className="text-muted-foreground">
                {cq.isFresh ? "🟢 Fresh" : cq.isCached ? "🟡 Stale" : "⚪ Empty"}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <QueryStatusBadge status={query.status} />
          <FetchStatusBadge fetchStatus={query.fetchStatus} />
        </div>

        {query.data?.data && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium">{query.data.data.name}</p>
            <p className="text-xs text-muted-foreground">
              {query.data.data.email} · {query.data.data.role}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 3. Invalidation Demo ──────────────────────────────────
function InvalidationDemo() {
  const queryClient = useQueryClient();
  const [invalidateCount, setInvalidateCount] = useState(0);

  const query = useQuery({
    queryKey: ["playground", "invalidation-demo"],
    queryFn: () => getUsersAction({ page: 1, limit: 2 }),
  });

  const handleInvalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["playground", "invalidation-demo"],
    });
    setInvalidateCount((c) => c + 1);
  };

  const handleRemove = () => {
    queryClient.removeQueries({
      queryKey: ["playground", "invalidation-demo"],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RefreshCcw className="h-4 w-4" />
          Query Invalidation
        </CardTitle>
        <CardDescription>
          Invalidate queries to trigger a background refetch. Remove to clear
          the cache entirely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <QueryStatusBadge status={query.status} />
          <FetchStatusBadge fetchStatus={query.fetchStatus} />
          <Badge variant="outline">Invalidated: {invalidateCount}x</Badge>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleInvalidate} className="gap-2">
            <RefreshCcw className="h-3.5 w-3.5" />
            Invalidate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => query.refetch()}
            className="gap-2"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Manual Refetch
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRemove}
            className="gap-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove Cache
          </Button>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-xs">
          <p className="font-medium text-muted-foreground mb-1">
            Data updated at:{" "}
            {query.dataUpdatedAt
              ? new Date(query.dataUpdatedAt).toLocaleTimeString()
              : "N/A"}
          </p>
          <p className="text-muted-foreground">
            Stale: {query.isStale ? "Yes" : "No"} · Fetching:{" "}
            {query.isFetching ? "Yes" : "No"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. Mutation States Demo ───────────────────────────────
function MutationDemo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      // Simulate a mutation with server action
      const response = await getUsersAction({ page: 1, limit: 1, search: name });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playground"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4" />
          Mutation States
        </CardTitle>
        <CardDescription>
          Observe mutation lifecycle: idle → pending → success/error
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <QueryStatusBadge status={mutation.status} />
          {mutation.submittedAt > 0 && (
            <Badge variant="outline" className="text-xs">
              Submitted: {new Date(mutation.submittedAt).toLocaleTimeString()}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => mutation.mutate("test")}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="mr-2 h-3.5 w-3.5" />
            )}
            Trigger Mutation
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => mutation.reset()}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        {/* State timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`h-2 w-2 rounded-full ${mutation.isIdle ? "bg-slate-400" : "bg-slate-200"}`}
            />
            <span className={mutation.isIdle ? "font-medium" : "text-muted-foreground"}>
              Idle
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`h-2 w-2 rounded-full ${mutation.isPending ? "bg-yellow-400 animate-pulse" : "bg-slate-200"}`}
            />
            <span className={mutation.isPending ? "font-medium" : "text-muted-foreground"}>
              Pending
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`h-2 w-2 rounded-full ${mutation.isSuccess ? "bg-green-400" : "bg-slate-200"}`}
            />
            <span className={mutation.isSuccess ? "font-medium" : "text-muted-foreground"}>
              Success
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`h-2 w-2 rounded-full ${mutation.isError ? "bg-red-400" : "bg-slate-200"}`}
            />
            <span className={mutation.isError ? "font-medium" : "text-muted-foreground"}>
              Error
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 5. Optimistic Update Demo ─────────────────────────────
function OptimisticUpdateDemo() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["playground", "optimistic-list"],
    queryFn: () => getUsersAction({ page: 1, limit: 5 }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate a slow delete
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return deleteUserAction(id);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["playground", "optimistic-list"],
      });

      const previous = queryClient.getQueryData<ApiResponse<User[]>>([
        "playground",
        "optimistic-list",
      ]);

      queryClient.setQueryData<ApiResponse<User[]>>(
        ["playground", "optimistic-list"],
        (old) =>
          old
            ? { ...old, data: old.data.filter((u) => u.id !== id) }
            : old
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["playground", "optimistic-list"],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["playground", "optimistic-list"],
      });
    },
  });

  const users = listQuery.data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4" />
          Optimistic Updates
        </CardTitle>
        <CardDescription>
          Delete a user — it disappears instantly (optimistic), then
          reconciles with the server. 2s artificial delay added.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <QueryStatusBadge status={listQuery.status} />
          <FetchStatusBadge fetchStatus={listQuery.fetchStatus} />
          {deleteMutation.isPending && (
            <Badge className="border-0 bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 animate-pulse">
              Deleting...
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {users.slice(0, 5).map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border p-2 px-3"
            >
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteMutation.mutate(user.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {users.length === 0 && !listQuery.isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No users left. Refresh to reload.
          </p>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => listQuery.refetch()}
          className="w-full gap-2"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refetch from Server
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── 6. Prefetch Demo ──────────────────────────────────────
function PrefetchDemo() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prefetchedIds, setPrefetchedIds] = useState<Set<string>>(new Set());
  const userIds = ["1", "2", "3", "4", "5"];

  const detailQuery = useQuery({
    queryKey: ["playground", "prefetch-detail", selectedId],
    queryFn: () => getUserAction(selectedId!),
    enabled: !!selectedId,
  });

  const handlePrefetch = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["playground", "prefetch-detail", id],
      queryFn: () => getUserAction(id),
      staleTime: 30_000,
    });
    setPrefetchedIds((prev) => new Set(prev).add(id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Timer className="h-4 w-4" />
          Prefetching
        </CardTitle>
        <CardDescription>
          Hover over a user to prefetch their data. Then click — it loads
          instantly from cache.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {userIds.map((id) => (
            <Button
              key={id}
              size="sm"
              variant={selectedId === id ? "default" : "outline"}
              onMouseEnter={() => handlePrefetch(id)}
              onClick={() => setSelectedId(id)}
              className="relative"
            >
              User {id}
              {prefetchedIds.has(id) && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </Button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          Prefetched: {prefetchedIds.size === 0
            ? "None"
            : Array.from(prefetchedIds).join(", ")}
        </div>

        {detailQuery.data?.data && (
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {detailQuery.isFetching ? "Fetching..." : "Loaded from cache"}
              </span>
            </div>
            <p className="text-sm font-medium">{detailQuery.data.data.name}</p>
            <p className="text-xs text-muted-foreground">
              {detailQuery.data.data.email} · {detailQuery.data.data.company}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 7. Retry Demo ─────────────────────────────────────────
function RetryDemo() {
  const [shouldFail, setShouldFail] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);

  const query = useQuery({
    queryKey: ["playground", "retry-demo", shouldFail],
    queryFn: async () => {
      setAttemptCount((c) => c + 1);
      if (shouldFail) {
        throw new Error("Simulated API failure");
      }
      return getUsersAction({ page: 1, limit: 2 });
    },
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    enabled: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RotateCcw className="h-4 w-4" />
          Retry Behavior
        </CardTitle>
        <CardDescription>
          Queries auto-retry on failure. Configure retry count and delay.
          Currently: 3 retries with exponential backoff.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <QueryStatusBadge status={query.status} />
          <FetchStatusBadge fetchStatus={query.fetchStatus} />
          <Badge variant="outline">Attempts: {attemptCount}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={shouldFail}
              onChange={(e) => {
                setShouldFail(e.target.checked);
                setAttemptCount(0);
              }}
              className="rounded"
            />
            Simulate failure
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              setAttemptCount(0);
              query.refetch();
            }}
          >
            <Zap className="mr-2 h-3.5 w-3.5" />
            Trigger Query
          </Button>
        </div>

        {query.error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {(query.error as Error).message}
          </div>
        )}

        {query.isSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Query succeeded!
          </div>
        )}

        {/* Retry timeline */}
        {query.failureCount > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Retry timeline:
            </p>
            {Array.from({ length: Math.min(query.failureCount, 4) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Attempt {i + 1} failed — retry in{" "}
                  {Math.min(1000 * 2 ** i, 10000)}ms
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Playground Page ───────────────────────────────────────
export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          TanStack Query Playground
        </h1>
        <p className="text-muted-foreground">
          Interactive demos showcasing TanStack Query v5 concepts. Open React
          Query Devtools (bottom-right) to inspect queries live.
        </p>
      </div>

      <Tabs defaultValue="queries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="mutations">Mutations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="queries" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <QueryStatusDemo />
            <CacheDemo />
          </div>
        </TabsContent>

        <TabsContent value="mutations" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <MutationDemo />
            <OptimisticUpdateDemo />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <InvalidationDemo />
            <PrefetchDemo />
          </div>
          <RetryDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
