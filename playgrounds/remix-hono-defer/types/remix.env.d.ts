import type {
	LinksFunction as RemixLinksFunction,
	LoaderFunctionArgs as RemixLoaderFunctionArgs,
	ActionFunctionArgs as RemixActionFunctionArgs,
	DataFunctionArgs,
	HeadersFunction as RemixHeadersFunction,
	AppLoadContext as RemixAppLoadContext,
	Session as RemixSession,
	MetaFunction as RemixMetaFunction,
	V2_HtmlMetaDescriptor,
	TypedResponse,
	// Change based on runtime
} from "@remix-run/node";
import type {
	useActionData,
	useLoaderData,
	useRouteLoaderData,
} from "@remix-run/react";
import type { ServerBuild as RemixServerBuild } from "@remix-run/server-runtime";

// Declares global types so we don't have to import them anywhere we just consume them
export declare global {
	type ServerBuild = RemixServerBuild;
	type Session<Data> = RemixSession<Data>;
	type AppLoadContext = RemixAppLoadContext;
	type MetaFunction<T = unknown> = RemixMetaFunction<T>;
	type HtmlMetaDescriptor = V2_HtmlMetaDescriptor;
	type LinksFunction = RemixLinksFunction;
	type LoaderFunctionArgs = RemixLoaderFunctionArgs;
	type ActionFunctionArgs = RemixActionFunctionArgs;
	type HeadersFunction = RemixHeadersFunction;
	type LoaderData<Loader> = ReturnType<typeof useLoaderData<Loader>>;
	type DataFunction<T> = (
		args: DataFunctionArgs,
	) => Promise<TypedResponse<T>>;
	type ActionData<Action> = ReturnType<typeof useActionData<Action>>;
	type RouteLoaderData<Loader> = ReturnType<
		typeof useRouteLoaderData<Loader>
	>;
	type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}
