# UserHub — User Management Dashboard

A **production-grade User Management Dashboard** built with Next.js App Router, TanStack Query v5, and modern enterprise frontend architecture. Designed as a comprehensive showcase of TanStack Query patterns for senior developers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)

---

## ✨ Features

### User Management (Full CRUD)
- **User List** — Searchable, sortable, paginated table with avatar display
- **User Details** — Profile card with role badges and company info
- **Create User** — Form with Zod validation and toast notifications
- **Edit User** — Pre-filled form with update mutation
- **Delete User** — Confirmation dialog with optimistic updates

### TanStack Query Patterns
| Pattern | Implementation |
|---------|---------------|
| `useQuery` with caching | `useUsers()`, `useUser()` |
| `keepPreviousData` | Pagination without flickering |
| `useMutation` | Create, Update, Delete operations |
| Optimistic Updates | Delete with `onMutate` / `onError` / `onSettled` |
| Query Invalidation | Granular cache invalidation via key factory |
| Query Key Factory | Centralized `userKeys` with hierarchical keys |
| Prefetching | Hover-to-prefetch on table rows |
| Server-Side Prefetch | `HydrationBoundary` + `dehydrate()` on all pages |
| React Query Devtools | Built-in — toggle from bottom-right corner |

### Interactive Playground (`/playground`)
Seven live demos showcasing TanStack Query concepts:
- **Query Lifecycle** — `idle` → `pending` → `success` / `error` visualization
- **Cache Visualization** — Fresh vs stale indicators with `staleTime` / `gcTime`
- **Query Invalidation** — Manual invalidate, refetch, and cache removal
- **Mutation States** — Real-time mutation lifecycle timeline
- **Optimistic Updates** — Delete with instant UI + rollback demo
- **Prefetching** — Hover-to-prefetch with cache hit indicators
- **Retry Behavior** — Configurable retry with exponential backoff

---

## 🏗️ Architecture

### Data Flow
```
UI Components (Server + Client)
        ↓
Custom Feature Hooks (useUsers, useUser, useCreateUser, etc.)
        ↓
TanStack Query (useQuery, useMutation, cache, optimistic updates)
        ↓
Server Actions ("use server")
        ↓
User Service (Axios)
        ↓
MockAPI (External REST API)
```

### Rules
- ✅ Components **never** call Axios directly
- ✅ Components **never** communicate with MockAPI directly
- ✅ Components only consume reusable hooks
- ✅ All API communication is encapsulated in Server Actions
- ✅ Query keys are **never** hardcoded — always from the factory
- ✅ No `any` types — strict TypeScript throughout

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Dashboard home
│   ├── loading.tsx               # Root loading state
│   ├── error.tsx                 # Root error boundary
│   ├── not-found.tsx             # 404 page
│   ├── users/
│   │   ├── page.tsx              # User list (HydrationBoundary)
│   │   ├── loading.tsx           # Table skeleton
│   │   ├── error.tsx             # Users error boundary
│   │   ├── create/page.tsx       # Create user form
│   │   ├── [id]/page.tsx         # User detail (HydrationBoundary)
│   │   └── [id]/edit/page.tsx    # Edit user (HydrationBoundary)
│   └── playground/page.tsx       # TanStack Query demos
│
├── actions/users/                # Server Actions (CRUD)
│   ├── get-users.ts
│   ├── get-user.ts
│   ├── create-user.ts
│   ├── update-user.ts
│   └── delete-user.ts
│
├── features/users/               # Feature-first module
│   ├── hooks/                    # TanStack Query hooks
│   │   ├── use-users.ts          # List query (keepPreviousData)
│   │   ├── use-user.ts           # Detail query
│   │   ├── use-create-user.ts    # Create mutation
│   │   ├── use-update-user.ts    # Update mutation
│   │   ├── use-delete-user.ts    # Delete with optimistic updates
│   │   └── use-prefetch-user.ts  # Hover-to-prefetch
│   ├── components/               # Feature UI components
│   ├── services/                 # Axios API calls
│   ├── schemas/                  # Zod validation
│   ├── types/                    # TypeScript interfaces
│   └── constants/                # Feature constants
│
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── common/                   # Shared components
│   ├── layouts/                  # Header, page header
│   └── dialogs/                  # Confirmation dialogs
│
├── providers/                    # QueryProvider, ThemeProvider
├── services/                     # Axios client singleton
├── lib/                          # Utils, query keys, constants, toast
├── config/                       # Environment & site config
└── types/                        # Global TypeScript types
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (Strict) |
| Data Fetching | [TanStack Query v5](https://tanstack.com/query) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Forms | [React Hook Form](https://react-hook-form.com/) |
| Validation | [Zod](https://zod.dev/) |
| UI Components | [Shadcn UI](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Toasts | [Sonner](https://sonner.emilkowal.dev/) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| Backend | [MockAPI](https://mockapi.io/) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Yarn](https://yarnpkg.com/) package manager

### 1. Clone the repository
```bash
git clone https://github.com/Kirankumar283/TanStack-Query.git
cd TanStack-Query
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_MOCK_API_URL=https://6a3ce276d8e212699e22f794.mockapi.io/api/v1
```

> **Note:** You can use the provided MockAPI URL above, or create your own project at [MockAPI.io](https://mockapi.io/) with a `users` resource.

### 4. Run the development server
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
yarn build
```

---

## 📡 MockAPI Schema

The `users` resource has the following schema:

```typescript
interface User {
  id: string;        // Auto-generated
  createdAt: string;  // ISO date string
  name: string;       // Full name
  avatar: string;     // Avatar URL
  email: string;      // Email address
  role: string;       // Job role/title
  company: string;    // Company name
}
```

Supported operations:
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List users (supports `search`, `page`, `limit`, `sortBy`, `order`) |
| `GET` | `/users/:id` | Get single user |
| `POST` | `/users` | Create user |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |

---

## 🔑 Key Implementation Details

### Query Key Factory
```typescript
// src/lib/query-keys.ts
export const userKeys = {
  all:     ["users"] as const,
  lists:   () => [...userKeys.all, "list"] as const,
  list:    (params) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail:  (id) => [...userKeys.details(), id] as const,
};
```

### Optimistic Delete
```typescript
// src/features/users/hooks/use-delete-user.ts
onMutate: async (id) => {
  await queryClient.cancelQueries({ queryKey: userKeys.lists() });
  const previousQueries = queryClient.getQueriesData({ queryKey: userKeys.lists() });
  queryClient.setQueriesData({ queryKey: userKeys.lists() }, (old) => ({
    ...old,
    data: old.data.filter((user) => user.id !== id),
  }));
  return { previousQueries }; // For rollback
},
onError: (_error, _id, context) => {
  // Rollback all list queries
  for (const [queryKey, data] of context.previousQueries) {
    queryClient.setQueryData(queryKey, data);
  }
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: userKeys.lists() });
},
```

### Server-Side Prefetching with Hydration
```typescript
// src/app/users/page.tsx (Server Component)
export default async function UsersPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: userKeys.list({ page: 1, limit: 8 }),
    queryFn: () => getUsersAction({ page: 1, limit: 8 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersTable />  {/* Client component — renders instantly */}
    </HydrationBoundary>
  );
}
```

### QueryClient Configuration
```typescript
// src/lib/get-query-client.ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // 60 seconds
      gcTime: 5 * 60 * 1000,      // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

---

## 🎨 UI Features

- **Dark/Light/System Theme** — Toggle from the header
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Loading Skeletons** — Table, card, and form skeleton states
- **Error Boundaries** — Route-level error handling with retry
- **Empty States** — Friendly messaging when no data
- **Toast Notifications** — Success, error, and loading toasts via Sonner
- **Color-Coded Badges** — Role-based color mapping

---

## 📋 Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Create production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |

---

## 📄 License

This project is for educational and demonstration purposes.

---

<p align="center">
  Built with ❤️ using Next.js, TanStack Query, and modern React patterns
</p>
