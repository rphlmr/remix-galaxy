/* eslint-disable no-console */
import path from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runMigrate() {
	const betterSqlite = new Database(`${__dirname}/sqlite.db`);

	const db = drizzle(betterSqlite, { logger: true });

	console.log("⏳ Running migrations...");

	const start = Date.now();

	migrate(db, { migrationsFolder: `${__dirname}/migrations` });

	const end = Date.now();

	console.log(`✅ Migration end & took ${end - start}ms`);

	process.exit(0);
}

try {
	runMigrate();
} catch (cause) {
	console.error("❌ Migration failed");
	console.error(cause);
	process.exit(1);
}
