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

// Mandatory to get fresh app version on each page load.
// Root loader always runs on each page load.
// Cost nothing if you don't use any db calls in the loader
export function shouldRevalidate() {
	return true;
}

export async function loader({ context }: LoaderFunctionArgs) {
	const appVersion = context.appVersion;

	if (!context.isAuthenticated) {
		return json(
			data({
				env: getBrowserEnv(),
				session: {},
				appVersion,
			}),
		);
	}

	const { accessToken, expiresAt, expiresIn, userId } = context.getSession();

	return json(
		data({
			env: getBrowserEnv(),
			// 👇 Use that in your AuthProvider?
			session: {
				accessToken,
				expiresAt,
				expiresIn,
				userId,
			},
			appVersion,
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
