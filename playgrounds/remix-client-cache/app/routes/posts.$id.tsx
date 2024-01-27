import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { db } from "~/database/db.server";
import { Post } from "~/database/schema.server";

export const meta: MetaFunction = () => [{ title: "Remix Client Cache" }];

export function loader({ params }: LoaderFunctionArgs) {
	const id = Number(params.id);
	const post = db.select().from(Post).where(eq(Post.id, id)).get();

	if (!post) {
		throw new Error("Post not found");
	}

	return json({ post });
}

export default function Index() {
	const { post } = useLoaderData<typeof loader>();

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>
				#{post.id} {post.title}
			</h1>
			<p>{post.content}</p>
		</div>
	);
}
