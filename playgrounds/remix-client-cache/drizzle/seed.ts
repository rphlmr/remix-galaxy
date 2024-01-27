/* eslint-disable no-console */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { faker } from "@faker-js/faker";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { Post } from "~/database/schema.server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
	const betterSqlite = new Database(`${__dirname}/sqlite.db`);

	const db = drizzle(betterSqlite, { logger: true });

	console.log("⏳ Running seed...");

	const start = Date.now();

	await Promise.all(
		new Array(600).fill(null).map(async () => {
			await db.insert(Post).values({
				title: faker.lorem.sentence(),
				content: faker.lorem.paragraphs(10),
			});
		}),
	);

	const end = Date.now();

	console.log(`✅ Seed end & took ${end - start}ms`);

	process.exit(0);
}

run().catch((err) => {
	console.error("❌ Seed failed");
	console.error(err);
	process.exit(1);
});
