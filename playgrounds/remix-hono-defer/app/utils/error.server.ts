import { createId } from "@paralleldrive/cuid2";
import type { Params } from "@remix-run/react";

// The goal of this custom error class is to normalize our errors.

type SerializableValue = string | number | boolean | object | null | undefined;

/**
 * Additional data to help us debug.
 */
export type AdditionalData = Record<string, SerializableValue>;

/**
 * @param message The message intended for the user.
 *
 * Other params are for logging purposes and help us debug.
 * @param label The label of the error to help us debug and filter logs.
 * @param cause The error that caused the rejection.
 * @param additionalData Additional data to help us debug.
 * @param type A type to qualify the error.
 *
 */
type FailureReason = {
	label:
		| "Unknown 🐞"
		| "Payload validation 👾"
		| "Parameter validation 👾"
		| "FormData validation 👾"
		| "Auth module 🔐"
		| "User module 👤"
		| "Dev error 🤦‍♂️";
	cause: unknown | null;
	message: string;
	additionalData?: AdditionalData;
	traceId?: string;
	type?: "default" | "user-not-exist" | "not-found";
	status?:
		| 200 // ok
		| 204 // no content
		| 400 // bad request
		| 401 // unauthorized
		| 403 // forbidden
		| 404 // not found
		| 404 // not found
		| 405 // method not allowed
		| 409 // conflict
		| 500; // internal server error;
};

/**
 * A custom error class to normalize the error handling in our app.
 */
export class AppError extends Error {
	readonly label: FailureReason["label"];
	readonly cause: FailureReason["cause"];
	readonly additionalData: FailureReason["additionalData"];
	readonly status: FailureReason["status"];
	traceId: FailureReason["traceId"];
	readonly type: FailureReason["type"];

	constructor({
		message,
		status,
		cause = null,
		additionalData,
		label,
		traceId,
		type = "default",
	}: FailureReason) {
		super();
		this.label = label;
		this.message = message;
		this.status = isLikeAppError(cause)
			? cause.status || status || 500
			: status || 500;
		this.cause = cause;
		this.additionalData = additionalData;
		this.traceId = traceId || createId();
		this.type = isLikeAppError(cause) ? cause.type || type : type;
	}
}

export function makeAppError(cause: unknown, additionalData?: AdditionalData) {
	if (isLikeAppError(cause)) {
		// copy the original error and fill in the maybe missing fields like status or traceId
		return new AppError({
			...cause,
			additionalData: {
				...cause.additionalData,
				...additionalData,
			},
		});
	}

	// 🤷‍♂️ We don't know what this error is, so we create a new default one.
	return new AppError({
		cause,
		message: "Désolé, une erreur imprévue est survenue.",
		additionalData,
		label: "Unknown 🐞",
	});
}

/**
 * This helper function is used to check if an error is an instance of `AppError` or an object that looks like an `AppError`.
 */
export function isLikeAppError(cause: unknown): cause is AppError {
	return (
		cause instanceof AppError ||
		(typeof cause === "object" &&
			cause !== null &&
			"name" in cause &&
			cause.name !== "Error" &&
			"message" in cause)
	);
}

type Options<T extends AdditionalData> = {
	additionalData?: T;
	message?: string;
	status?: AppError["status"];
};

export function badFormSubmission<Submission, T extends AdditionalData>(
	submission: Submission,
	{ additionalData, message, status }: Options<T> = {},
) {
	return new AppError({
		cause: null,
		label: "Payload validation 👾",
		message: message || "The form submission is invalid.",
		additionalData: { ...additionalData, submission } as T & {
			submission: Submission;
		},
		status: status || 400,
	});
}

export function badSearchParams<Submission, T extends AdditionalData>(
	submission: Submission,
	{ additionalData, message, status }: Options<T> = {},
) {
	return new AppError({
		cause: null,
		label: "Payload validation 👾",
		message: message || "Invalid search params.",
		additionalData: { ...additionalData, submission } as T & {
			submission: Submission;
		},
		status: status || 400,
	});
}

export function badRequestParams<
	P extends Params<string>,
	T extends AdditionalData,
>(params: P, { additionalData, message, status }: Options<T> = {}) {
	return new AppError({
		cause: null,
		label: "Parameter validation 👾",
		message: message || "Invalid request params.",
		additionalData: { ...additionalData, params } as T & {
			params: P;
		},
		status: status || 400,
	});
}

export function notAllowedMethod(method: string) {
	return new AppError({
		cause: null,
		label: "Dev error 🤦‍♂️",
		message: `"${method}" method is not allowed.`,
		status: 405,
	});
}

export function notAllowedAction(actionType: string) {
	return new AppError({
		cause: null,
		label: "Dev error 🤦‍♂️",
		message: `"${actionType}" is not allowed.`,
		status: 405,
	});
}

export function unAuthorized<T extends AdditionalData>(
	name: AppError["label"],
	{ additionalData, message }: Options<T> = {},
) {
	return new AppError({
		cause: null,
		label: name,
		message: message || "You are not authorized to perform this action.",
		additionalData: { ...additionalData } as T,
		status: 401,
	});
}
