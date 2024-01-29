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
import _ from "lodash";
import { InView } from "react-intersection-observer";
import {
	cacheClientLoader,
	createCacheAdapter,
	useCachedLoaderData,
} from "remix-client-cache";

import { db } from "~/database/db.server";
import { Post } from "~/database/schema.server";
import { CacheStorage } from "~/utils";

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

	return json({
		posts,
		searchParams: {
			page,
			limit,
		},
	});
}

type LoaderDataType = SerializeFrom<typeof loader>;

const paginationStore = new CacheStorage<
	LoaderDataType,
	Pick<LoaderDataType, "posts">
>({
	key: "posts",
	engine: typeof document !== "undefined" ? localStorage : undefined,
	select: (loaderData) => ({
		posts: loaderData.posts,
	}),
	transform: (store, loaderData) => {
		let posts = _.concat(store?.posts || [], loaderData.posts);

		if ("searchParams" in loaderData) {
			const { limit, page } = loaderData.searchParams;
			const start = page === 0 ? 0 : page * limit;
			const end = start + limit;

			posts = _.concat(
				_.differenceBy(
					store?.posts,
					_.slice(store?.posts, start, end),
					"id",
				),
				loaderData.posts,
			);
		}

		posts = _.sortedUniqBy(
			posts.sort((a, b) => a.id - b.id),
			"id",
		);

		return {
			posts,
		};
	},
});

const { adapter } = createCacheAdapter(() => paginationStore); // uses localStorage behind the scenes

// Caches the loader data on the client
export const clientLoader = (args: ClientLoaderFunctionArgs) =>
	cacheClientLoader(args, {
		adapter,
		key: paginationStore.key,
	});

// make sure you turn this flag on
clientLoader.hydrate = true;

export default function Index() {
	// You need it to trigger re-renders when the data changes in localStorage
	useCachedLoaderData<typeof loader>({ adapter });
	const allPosts = paginationStore.getItem()?.posts ?? [];
	const [searchParams, setSearchParams] = useSearchParams();
	const { limit, page } = getPageLimit(searchParams);

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
