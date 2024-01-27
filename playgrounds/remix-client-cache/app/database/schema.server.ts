import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Post = sqliteTable("post", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	content: text("title").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
