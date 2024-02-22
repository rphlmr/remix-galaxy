import {
	unstable_createMemoryUploadHandler,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
	unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [
	{ title: "New Remix App" },
	{ name: "description", content: "Welcome to Remix!" },
];

export function loader({ context }: LoaderFunctionArgs) {
	const { appVersion } = context;
	const message = "Hello World from Remix Vite loader";
	console.log(message, appVersion);
	return { message, appVersion };
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const uploadHandler = unstable_createMemoryUploadHandler();

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	);
	console.log("file", formData.get("file"));

	return null;
};

export default function Index() {
	const { message, appVersion } = useLoaderData<typeof loader>();
	return (
		<div>
			<h1 className="text-3xl font-bold text-purple-500">
				Welcome to Remix Vite !
			</h1>
			<label>
				Should persist state across
				<input type="text" placeholder="HMR test" />
			</label>
			<Form encType="multipart/form-data" method="POST">
				<input type="file" accept="image/*" name="file" />
				<button type="submit">Submit</button>
			</Form>
			<ul>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
						className="text-blue-500"
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/jokes"
						rel="noreferrer"
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/docs"
						rel="noreferrer"
					>
						Remix Docs
					</a>
				</li>
			</ul>

			<div>{message}</div>
			<div>appVersion: {appVersion}</div>
		</div>
	);
}
