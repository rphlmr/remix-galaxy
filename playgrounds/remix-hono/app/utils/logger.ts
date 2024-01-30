// import * as Sentry from "@sentry/remix";
import pino from "pino";

import { env } from "./env";
import { AppError } from "./error.server";

function serializeError<E extends Error>(error: E): Error {
	if (!(error.cause instanceof Error)) {
		return {
			...error,
			stack: error.stack,
		};
	}

	return {
		...error,
		cause: serializeError(error.cause),
		stack: error.stack,
	};
}

const logger = pino({
	level: "debug",
	serializers: {
		err: (cause) => {
			if (!(cause instanceof AppError)) {
				return pino.stdSerializers.err(cause);
			}
			return serializeError(cause);
		},
	},
});

/**
 * A simple logger abstraction that can be used to log messages in the console.
 *
 * You could interface with a logging service like Sentry or LogRocket here.
 */
export class Logger {
	static dev(...args: unknown[]) {
		if (env.NODE_ENV === "development") {
			logger.debug(args);
		}
	}
	static log(...args: unknown[]) {
		logger.info(args);
	}
	static warn(...args: unknown[]) {
		logger.warn(args);
	}
	static info(...args: unknown[]) {
		logger.info(args);
	}
	static error(error: unknown) {
		logger.error(error);

		// if (env.SENTRY_DSN) {
		//     Sentry.captureException(error);
		// }
	}
}
