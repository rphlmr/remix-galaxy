import { Suspense } from "react";

import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";

import { wait } from "~/utils/wait";

const products = [
	{ id: "1", name: "Product 1" },
	{ id: "2", name: "Product 2" },
	{ id: "3", name: "Product 3" },
	{ id: "4", name: "Product 4" },
] as const;

async function getProducts() {
	await wait(3_000);
	return products;
}

export function loader() {
	return defer({
		products: getProducts(),
	});
}

export default function Index() {
	const { products } = useLoaderData<typeof loader>();
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Defer home 2</h1>
			<Suspense fallback={<p>Loading ...</p>}>
				<ul>
					<Await resolve={products}>
						{(products) =>
							products.map((p) => (
								<li key={p.id}>
									<Link key={p.id} to={`/${p.id}`}>
										{p.name}
									</Link>
								</li>
							))
						}
					</Await>
				</ul>
			</Suspense>
		</div>
	);
}
