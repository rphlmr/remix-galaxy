<div align="center">
  <img src="https://github.com/rphlmr/supa-fly-stack/assets/20722140/06a0310e-f97b-4cd9-9eaa-e380c4d184bf" alt="rphlmr_remix_galaxy" />
</div>

# Welcome to Remix Client Cache demo

- [remix-client-cache](https://github.com/Code-Forge-Net/remix-client-cache)
- Implements `react-intersection-observer` to handle an infinite scroll by page number and limit

# What I try to achieve
Infinite scroll + client cache merged server data.

By default, cached values (our posts) will be swapped with new posts coming from the loader.

This end to a mess 😅.

So I have implemented a custom CacheProvider that will merge the new posts with the cached ones.

# Setup

## Step 1 - Install dependencies
> **Note**
> 
> 💡 If you are not in the `playgrounds/remix-client-cache` directory, run these commands with `npm run -w playgrounds/remix-client-cache <command>`

```sh
cd playgrounds/remix-client-cache
npm install
```

## Step 2 - Run SQLite database migrations
```sh
npm run db:migration:run
```

## Step 3 - Seed SQLite database
```sh
npm run db:seed
```

## Step 4 - Start Remix server
```sh
npm run dev
```

# Want to play?

Run Drizzle studio:
```sh
npm run db:studio
```

Then scroll to the bottom (around post #200).

Change post #1 title (on drizzle studio).

Look at your cache, 'old values' are still here 😎.

Scroll to top, and check your cache again, 'old values' are gone 😎.