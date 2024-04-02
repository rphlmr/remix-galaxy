import { type MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { getPath, getQueryStrings } from "hono/utils/url";

/**
 * Cache middleware
 *
 * @param seconds - The number of seconds to cache
 */
export function cache(seconds: number) {
	return createMiddleware(async (c, next) => {
		if (!c.req.path.match(/\.[a-zA-Z0-9]+$/) || c.req.path.endsWith(".data")) {
			return next();
		}

		await next();

		if (!c.res.ok) {
			return;
		}

		c.res.headers.set("cache-control", `public, max-age=${seconds}`);
	});
}

enum LogPrefix {
	Outgoing = "-->",
	Incoming = "<--",
	Error = "xxx",
}
const time = (start: number) => {
	const delta = Date.now() - start;
	return delta + "ms";
};

function log(
	prefix: string,
	method: string,
	path: string,
	status: number = 0,
	elapsed?: string,
) {
	const out =
		prefix === LogPrefix.Incoming
			? `  ${prefix} ${method} ${path}`
			: `  ${prefix} ${method} ${path} ${status} ${elapsed}`;
	// eslint-disable-next-line no-console
	console.log(out);
}

export const logger = (): MiddlewareHandler =>
	async function logger(c, next) {
		const { method } = c.req;
		const path = getPath(c.req.raw) + getQueryStrings(c.req.raw.url);

		log(LogPrefix.Incoming, method, path);

		const start = Date.now();

		await next();

		const { status } = new Response(null, c.res);

		log(LogPrefix.Outgoing, method, path, status, time(start));
	};
