/** @type {import('@remix-run/dev').AppConfig} */
export default {
	ignoredRouteFiles: ["**/.*"],
	server: "./server/index.ts",
	serverBuildPath: "./build/index.js",
	serverPlatform: "node",
	serverDependenciesToBundle: [/^remix-hono*/],
	watchPaths: ["./server/**/*.ts"],
	serverModuleFormat: "cjs",
	dev: {
		command: "node build/index.js",
		// 👇 For https dev server
		// tlsCert: "./server/dev/cert.pem",
		// tlsKey: "./server/dev/key.pem",
	},
	future: {},
};
