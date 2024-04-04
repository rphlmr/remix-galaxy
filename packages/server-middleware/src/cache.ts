import { createMiddleware } from "hono/factory";

/**
 * Cache middleware
 *
 * @param seconds - The number of seconds to cache
 */
export function cache(seconds: number) {
	return createMiddleware(async (c, next) => {
		console.log("cache middleware called for: ", c.req.path);

		if (
			!c.req.path.match(/\.[a-zA-Z0-9]+$/) ||
			c.req.path.endsWith(".data")
		) {
			return next();
		}

		await next();

		if (!c.res.ok) {
			return;
		}

		c.res.headers.set("cache-control", `public, max-age=${seconds}`);
	});
}
