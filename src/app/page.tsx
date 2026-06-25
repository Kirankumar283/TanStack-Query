import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FlaskConical,
  Zap,
  Database,
  RefreshCcw,
  Shield,
  Layers,
  GitBranch,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Query Caching",
    description: "Automatic caching with configurable stale times and garbage collection",
  },
  {
    icon: RefreshCcw,
    title: "Background Refetching",
    description: "Seamless background updates with placeholder data and stale-while-revalidate",
  },
  {
    icon: Zap,
    title: "Optimistic Updates",
    description: "Instant UI feedback with automatic rollback on mutation failure",
  },
  {
    icon: Layers,
    title: "Server-Side Prefetching",
    description: "HydrationBoundary pattern for zero-loading-state initial renders",
  },
  {
    icon: GitBranch,
    title: "Query Invalidation",
    description: "Granular cache invalidation with the query key factory pattern",
  },
  {
    icon: Shield,
    title: "Type Safety",
    description: "End-to-end TypeScript from Zod schemas through Server Actions to hooks",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-4 text-center pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium">
          <Zap className="h-3.5 w-3.5 text-primary" />
          TanStack Query v5 Showcase
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          User Management
          <br />
          <span className="text-muted-foreground">Dashboard</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A production-grade Next.js application demonstrating enterprise-level
          TanStack Query patterns, Server Actions, clean architecture, and
          modern React best practices.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link href="/users">
            <Button size="lg" className="gap-2">
              <Users className="h-4 w-4" />
              View Users
            </Button>
          </Link>
          <Link href="/playground">
            <Button size="lg" variant="outline" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              Playground
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Key Patterns Demonstrated
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-colors hover:border-primary/30"
            >
              <CardHeader className="pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="space-y-4 text-center pb-8">
        <h2 className="text-2xl font-bold tracking-tight">Data Flow</h2>
        <div className="mx-auto max-w-md">
          <div className="space-y-2">
            {[
              "UI Components",
              "Custom Feature Hooks",
              "TanStack Query",
              "Server Actions",
              "MockAPI",
            ].map((layer, i) => (
              <div key={layer}>
                <div className="rounded-lg border bg-card p-3 font-mono text-sm">
                  {layer}
                </div>
                {i < 4 && (
                  <div className="flex justify-center py-1 text-muted-foreground">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
