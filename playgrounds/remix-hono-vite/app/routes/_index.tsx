import {
	unstable_createMemoryUploadHandler,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
	unstable_parseMultipartFormData,
	json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [
	{ title: "New Remix App" },
	{ name: "description", content: "Welcome to Remix!" },
];

export function loader({ context }: LoaderFunctionArgs) {
	const { appVersion } = context;
	const message = "Hello World from Remix Vite loader";
	console.log(message, appVersion);
	return json({ message, appVersion });
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const uploadHandler = unstable_createMemoryUploadHandler();

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	);
	console.log("file", formData.get("file"));

	return json({ fileName: (formData.get("file") as File).name });
};

export default function Index() {
	const { message, appVersion } = useLoaderData<typeof loader>();
	const { fileName } = useActionData<typeof action>() ?? {};
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl font-bold text-purple-500">
				Welcome to Remix Vite!
			</h1>
			<label>
				Should persist state across HMR
				<input type="text" placeholder="HMR test" className="ml-2" />
			</label>
			<Form
				encType="multipart/form-data"
				method="POST"
				className="flex w-fit flex-col rounded-md border border-white bg-zinc-900 p-4 text-white"
			>
				<label className="text-white">Upload a file</label>
				<input type="file" accept="image/*" name="file" />
				<button
					type="submit"
					className="w-fit rounded-md bg-white p-2 text-black"
				>
					Submit
				</button>
				<span>File name after upload: {fileName}</span>
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
