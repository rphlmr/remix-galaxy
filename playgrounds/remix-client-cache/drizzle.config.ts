import { Config } from "drizzle-kit";

export default {
	out: "./drizzle/migrations",
	schema: "./app/database/schema.server.ts",
	// verbose: true,
	// strict: true,
} satisfies Config;
