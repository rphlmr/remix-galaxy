import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import * as serverBuild from "@remix-run/dev/server-build";
import { broadcastDevReady } from "@remix-run/server-runtime";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { remix } from "remix-hono/handler";

import { initEnv, env } from "~/utils/env";

import { cache } from "./middlewares";

// Server will not start if the env is not valid
initEnv();

const build = serverBuild as ServerBuild;

const mode = env.NODE_ENV === "test" ? "development" : env.NODE_ENV;

const app = new Hono();

/**
 * Serve build files from public/build
 */
app.use("/build/*", cache(0), serveStatic({ root: "./public" }));

/**
 * Serve static files from public
 */
app.use("/static/*", cache(0), serveStatic({ root: "./public" })); // 1 hour

/**
 * Add logger middleware
 */
app.use("*", logger());

/**
 * Add remix middleware to Hono server
 */
app.use(
	remix({
		build,
		mode,
	}),
);

/**
 * Start the server
 */
serve(
	mode === "production"
		? {
				...app,
				port: Number(process.env.PORT) || 3000,
			}
		: {
				...app, // 👇 is for https dev server. If you go that route, remove `...app`
				// createServer, // import { createSecureServer } from "node:http2";
				// serverOptions: {},
				// serverOptions: {
				// 	key: fs.readFileSync("./server/dev/key.pem"), // import fs from "node:fs";
				// 	cert: fs.readFileSync("./server/dev/cert.pem"),

				// },
				port: Number(process.env.PORT) || 3000,
			},
	async (info) => {
		// eslint-disable-next-line no-console
		console.log(`🚀 Server started on port ${info.port}`);

		if (mode === "development") {
			const os = await import("node:os");
			const dns = await import("node:dns");
			await new Promise((resolve) => {
				dns.lookup(os.hostname(), 4, (_, address) => {
					// If you want to use https dev server, you need to change http to https
					// eslint-disable-next-line no-console
					console.log(
						`🌍 http://localhost:${info.port} - http://${
							address || info.address
						}:${info.port}`,
					);

					resolve(null);
				});
			});

			void broadcastDevReady(build);
		}
	},
);
