Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
pnpm lint
pnpm format
pnpm check
```

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

## Todo App (TanStack Start)

A lightweight Todo application built with TanStack Start, TanStack Store, and Tailwind. Todos are stored in the browser via `localStorage`, so no backend or database setup is required.

### Tech Stack

- TanStack Start (Vite-powered) + TanStack Router
- State: `@tanstack/react-store`
- Styling: Tailwind CSS + shadcn/ui primitives

### Features

- Create, update, complete/incomplete, delete
- Archive/unarchive with archived filter
- Inline editing with title/description
- Filters: All, Active, Completed, Archived
- Bulk clear: completed or archived
- Local persistence via `localStorage` (key: `tanstack-todos`)

### Quick Start

```bash
pnpm install
pnpm dev  # runs on http://localhost:3000
```

Open the todo UI at `http://localhost:3000/demo/todos`.

### Scripts

```bash
pnpm dev      # start dev server
pnpm build    # production build
pnpm preview  # preview build
pnpm lint     # eslint
pnpm format   # prettier check
pnpm test     # vitest
```

### Storage Details

- Persistence: Browser `localStorage`
- Key: `tanstack-todos`
- Shape per item: `{ id, title, description?, completed, archived, createdAt, updatedAt }`
- SSR-safe: `localStorage` access is guarded with `typeof window === 'undefined'`

### Key Files

- `src/lib/todo-store.ts` – TanStack Store setup, actions, and localStorage sync
- `src/components/TodoList.tsx` – UI with filters, inline editing, bulk actions
- `src/routes/demo/todos.tsx` – Route that renders the todo list
- `src/components/Header.tsx` – Nav link to the Todo page

### Notes


  <TanStackRouterDevtools />
  </>
  ),
  });

````

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
````

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

function App() {
  const count = useStore(countStore)
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  )
}

export default App
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store, Derived } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
doubledStore.mount()

function App() {
  const count = useStore(countStore)
  const doubledCount = useStore(doubledStore)

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  )
}

export default App
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
