import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";

import { env, getBrowserEnv } from "./utils/env";
import { data, json } from "./utils/http.server";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
	{
		href: "/static/favicon.ico",
		rel: "apple-touch-icon",
	},
	{
		href: "/static/favicon.ico",
		rel: "icon",
	},
];

export const meta: MetaFunction = () => [
	{
		title: env.APP_NAME,
	},
];

export function loader() {
	return json(
		data({
			env: getBrowserEnv(),
		}),
	);
}

export default function App() {
	const { env } = useLoaderData<typeof loader>();
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.env = ${JSON.stringify(env)}`,
					}}
				/>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
