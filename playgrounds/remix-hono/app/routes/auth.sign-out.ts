import { redirect } from "~/utils/http.server";

export async function loader({ context }: ActionFunctionArgs) {
	// This is how you delete an auth session
	context.destroySession();

	return redirect("/");
}
