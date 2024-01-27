/* eslint-disable no-console */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

async function runMigrate() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const betterSqlite = new Database(":memory:");

	const db = drizzle(betterSqlite, { logger: true });

	console.log("⏳ Running migrations...");

	const start = Date.now();

	migrate(db, { migrationsFolder: `${__dirname}/migrations` });

	const end = Date.now();

	console.log(`✅ Migration end & took ${end - start}ms`);

	process.exit(0);
}

runMigrate().catch((err) => {
	console.error("❌ Migration failed");
	console.error(err);
	process.exit(1);
});
