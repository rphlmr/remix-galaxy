import {
	defer,
	json,
	redirect,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_parseMultipartFormData as parseMultipartFormData,
	createCookie,
	createCookieSessionStorage,
	type CookieSerializeOptions,
	type Cookie,
} from "@remix-run/node"; // 💡 Swap to cloudflare in one line. This is why I'm using this technique.

import type { AppError } from "./error.server";
import { Logger } from "./logger";

/**
 * Re-exporting to easily swap server adapter
 */
export {
	json,
	defer,
	redirect,
	composeUploadHandlers,
	parseMultipartFormData,
	createCookie,
	createCookieSessionStorage,
	Cookie,
	CookieSerializeOptions,
};

export type ResponsePayload = Record<string, unknown> | null;

/**
 * Create a data response payload.
 *
 * Normalize the data to return to help type inference.
 *
 * @param data - The data to return
 * @returns The normalized data with `error` key set to `null`
 */
export function data<T extends ResponsePayload>(data: T) {
	return { error: null, ...data };
}

export type DataResponse<T extends ResponsePayload = ResponsePayload> =
	ReturnType<typeof data<T>>;

/**
 * Create an error response payload.
 *
 * Normalize the error to return to help type inference.
 *
 * @param cause - The error that has been catch
 * @returns The normalized error with `error` key set to the error
 */
export function error(cause: AppError) {
	Logger.error(cause);

	return {
		error: {
			message: cause.message,
			label: cause.label,
			...(cause.additionalData && {
				additionalData: cause.additionalData,
			}),
			...(cause.traceId && { traceId: cause.traceId }),
			...(cause.type && { type: cause.type }),
		},
	};
}

export type ErrorResponse = ReturnType<typeof error>;

export type DataOrErrorResponse<T extends ResponsePayload = ResponsePayload> =
	| ErrorResponse
	| DataResponse<T>;

export function setCookie(cookieValue: string): [string, string] {
	return ["Set-Cookie", cookieValue];
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect = "/",
) {
	if (
		!to ||
		typeof to !== "string" ||
		!to.startsWith("/") ||
		to.startsWith("//")
	) {
		return defaultRedirect;
	}

	return to;
}

export function getSearchParam(request: Request, name: string) {
	const url = new URL(request.url);
	return url.searchParams.get(name)?.trim();
}

export function getRedirectTo(request: Request, defaultRedirectTo = "/") {
	const url = new URL(request.url);
	return safeRedirect(url.searchParams.get("redirectTo"), defaultRedirectTo);
}
