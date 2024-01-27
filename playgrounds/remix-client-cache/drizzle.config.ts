import { Config } from "drizzle-kit";

export default {
	out: "./drizzle/migrations",
	schema: "./app/database/schema.server.ts",
	dbCredentials: {
		url: "./drizzle/sqlite.db",
	},
	driver: "better-sqlite",
	// verbose: true,
	// strict: true,
} satisfies Config;
