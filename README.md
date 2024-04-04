<div align="center">
  <h1 align="center"><a href="https://twitter.com/rphlmr" >@rphlmr's</a> <a href="https://remix.run">Remix Galaxy</a></h1>
  <strong align="center">
    👋 This is an opinionated collection of stuff built with Remix that I use for building my apps.
  </strong>
  <p>
   It mainly uses <a href="https://orm.drizzle.team">Drizzle ORM</a>, <a href="https://supabase.com">Supabase</a>, <a href="https://hono.dev/">Hono</a>, <a href="https://ui.shadcn.com/">shadcn/ui</a> & <a href="https://tailwindcss.com/">tailwindcss</a>.
  </p>
</div>

<div align="center">
  <img src="https://github.com/rphlmr/supa-fly-stack/assets/20722140/06a0310e-f97b-4cd9-9eaa-e380c4d184bf" alt="rphlmr_remix_galaxy" />
</div>

---

> [!NOTE]
> This is a [Turborepo](https://turbo.build/repo) with npm workspaces.

## What's inside?

### Stacks

> A good starting for a new project or to learn about Remix Run.

-   `@remix-galaxy/psst` `🔥 coming soon`
    > A [PWA](https://github.com/remix-pwa/monorepo) with native push notifications.
    > <br />
    > 👉 `hono` + `supabase` + `drizzle` + `tailwindcss` + `shadcn/ui`

### Playgrounds

> Some experiments

-   `@remix-galaxy/remix-hono-vite` `🆕 new`
    > Vite, [Hono](https://hono.dev) and [Remix Hono](https://github.com/sergiodxa/remix-hono)

### Packages

> Things I use in multiple projects

-   `@remix-galaxy/ui`: shadcn/ui components
-   `@remix-galaxy/eslint-config`: base `eslint` configurations
-   `@remix-galaxy/typescript-config`: base `tsconfig.json` used throughout the monorepo

Each package/stack is 100% [TypeScript](https://www.typescriptlang.org/).

### Install

To install all packages, run the following command:

```
cd remix-galaxy
npm install
```

### Develop

To develop all apps and packages, run the following command:

```
cd remix-galaxy
npm run -w <workspace> dev
```

#### Install a npm package in a project

To install a package in a project, run the following command:

```
cd remix-galaxy
npm install -w <workspace> <package>
# e.g.
npm install -w @remix-galaxy/psst @remix-galaxy/ui
```

> Note: Check the turbo docs: [Adding/removing/upgrading packages](https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages)

### Build

To build all apps and packages, run the following command:

```
cd remix-galaxy
npm run build
```

### Utilities

This Turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

## Useful Links

Learn more about the power of Turborepo:

-   [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
-   [Caching](https://turbo.build/repo/docs/core-concepts/caching)
-   [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
-   [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
-   [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
-   [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
