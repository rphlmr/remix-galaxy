import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader({ params }: LoaderFunctionArgs) {
	const id = params.id;

	return json({
		id,
	});
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
