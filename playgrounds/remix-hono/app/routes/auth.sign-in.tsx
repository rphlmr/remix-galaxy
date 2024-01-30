import { Form, useLoaderData } from "@remix-run/react";

import { type AuthSession } from "server/session";
import { makeAppError } from "~/utils/error.server";
import {
	redirect,
	safeRedirect,
	json,
	error,
	getRedirectTo,
	data,
} from "~/utils/http.server";

export function loader({ context, request }: LoaderFunctionArgs) {
	if (context.isAuthenticated) {
		return redirect("/");
	}

	const redirectTo = getRedirectTo(request);

	return json(
		data({
			redirectTo,
		}),
	);
}

async function fakeSignIn({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	return {
		userId: email,
		accessToken: `fake-access-token${password}`,
		refreshToken: "fake-refresh-token",
		expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
		expiresIn: 60 * 60, // 1 hour
	} satisfies AuthSession;
}

export async function action({ request, context }: ActionFunctionArgs) {
	try {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const redirectTo = formData.get("redirectTo") as string;

		const authSession = await fakeSignIn({
			email,
			password,
		});

		// Set auth session in context. It will be auto committed on response header by session middleware
		context.setSession(authSession);

		return redirect(safeRedirect(redirectTo) || "/");
	} catch (cause) {
		const reason = makeAppError(cause);
		return json(error(reason), { status: reason.status });
	}
}

export default function SignInPage() {
	const { redirectTo } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Sign In</h1>
			<Form action="/auth/sign-in" method="POST">
				<input type="hidden" name="redirectTo" value={redirectTo} />
				<label htmlFor="email">Email</label>
				<input type="email" name="email" id="email" />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<button type="submit">Sign In</button>
			</Form>
		</div>
	);
}
