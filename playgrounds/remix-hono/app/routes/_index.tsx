import { Link, useLoaderData } from "@remix-run/react";

import { env } from "~/utils/env";
import { data, json } from "~/utils/http.server";

export async function loader({ context }: LoaderFunctionArgs) {
	return json(
		data({
			isAuthenticated: context.isAuthenticated,
		}),
	);
}

export default function Index() {
	const { isAuthenticated } = useLoaderData<typeof loader>();
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to {env.APP_NAME}</h1>
			{isAuthenticated ? (
				<Link to="/secure">Secure zone</Link>
			) : (
				<Link to="/auth/sign-in">Sign In</Link>
			)}
		</div>
	);
}
