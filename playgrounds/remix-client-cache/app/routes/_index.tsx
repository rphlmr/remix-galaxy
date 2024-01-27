import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
	type SerializeFrom,
} from "@remix-run/node";
import {
	type ClientLoaderFunctionArgs,
	Link,
	useSearchParams,
} from "@remix-run/react";
import { InView } from "react-intersection-observer";
import {
	type CacheAdapter,
	cacheClientLoader,
	createCacheAdapter,
	useCachedLoaderData,
} from "remix-client-cache";

import { db } from "~/database/db.server";
import { Post } from "~/database/schema.server";

// Disclaimer: I assume the type here for simplicity.
type LoaderData = SerializeFrom<typeof loader>;
type CachedData = LoaderData | undefined;

class SuperLocalStorage implements CacheAdapter {
	key = "posts";

	uniquePostById(posts: LoaderData["posts"]) {
		return [
			...new Map(
				posts.filter(Boolean).map((item) => [item["id"], item]),
			).values(),
		];
	}

	mergePostsWithCache(posts: LoaderData["posts"]) {
		const cachedData = this.getItem();
		return this.uniquePostById([...cachedData.posts, ...posts]);
	}

	getItem() {
		// Disclaimer: I assume the type here for simplicity.
		return (
			(JSON.parse(
				localStorage.getItem(this.key) || "null",
			) as CachedData) || { posts: [] }
		);
	}

	async setItem(key: string, value: LoaderData) {
		const cachedData = this.getItem();

		// set the item in the database
		return localStorage.setItem(
			key,
			JSON.stringify({
				...cachedData,
				...value,
				posts: this.uniquePostById([
					...cachedData.posts,
					...value.posts,
				]),
			} satisfies LoaderData),
		);
	}

	async removeItem(key: string) {
		// remove the item from the database
		return localStorage.removeItem(key);
	}
}

const { adapter } = createCacheAdapter(() => new SuperLocalStorage()) as {
	adapter: SuperLocalStorage | undefined;
}; // uses localStorage behind the scenes

export const meta: MetaFunction = () => [{ title: "Remix Client Cache" }];

// How many posts to load per page
const LIMIT = 100;
// Every time we scroll within LIMIT - TRIGGER_THRESHOLD posts of the bottom or top, we'll load more
// Adjust this number to make it more or less sensitive / smooth
const TRIGGER_THRESHOLD = 20;

function getPageLimit(searchParams: URLSearchParams) {
	return {
		page: Number(searchParams.get("page") || 0),
		limit: Number(LIMIT.toString()),
	};
}

export function loader({ request }: LoaderFunctionArgs) {
	const { page, limit } = getPageLimit(new URL(request.url).searchParams);

	const posts = db
		.select()
		.from(Post)
		.limit(limit)
		.offset(page * limit)
		.all();

	return json({ posts });
}

// Caches the loader data on the client
export const clientLoader = (args: ClientLoaderFunctionArgs) =>
	cacheClientLoader(args, {
		// We pass our custom adapter to the clientLoader
		adapter,
		key: "posts",
	});

// make sure you turn this flag on
clientLoader.hydrate = true;

export default function Index() {
	const { posts } = useCachedLoaderData<typeof loader>({ adapter });
	const [searchParams, setSearchParams] = useSearchParams();
	const { limit, page } = getPageLimit(searchParams);
	const allPosts = adapter ? adapter.mergePostsWithCache(posts) : posts;

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			{allPosts.map((post, index) => {
				const currentIndex = index + 1;
				const nextPage =
					currentIndex === TRIGGER_THRESHOLD
						? 0
						: Math.ceil(currentIndex / limit);
				const isAnchor =
					(currentIndex === TRIGGER_THRESHOLD && page !== 0) ||
					currentIndex % limit === limit - TRIGGER_THRESHOLD;

				return (
					<InView
						key={post.id}
						onChange={(inView) => {
							if (!isAnchor || (isAnchor && !inView)) {
								return;
							}

							setSearchParams(
								nextPage === 0
									? undefined
									: {
											page: String(nextPage),
										},
								{ replace: true },
							);
						}}
					>
						<Link to={`/posts/${post.id}`}>
							<strong>
								#{post.id} {post.title}
							</strong>
						</Link>
					</InView>
				);
			})}
		</div>
	);
}
