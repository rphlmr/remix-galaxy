import { useLoaderData } from "@remix-run/react";

import { data, json } from "~/utils/http.server";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = params.id;

	return json(
		data({
			id,
		}),
	);
}
export default function Index() {
	const { id } = useLoaderData<typeof loader>();
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Defer {id}</h1>
			<p>Id: {id}</p>
		</div>
	);
}
