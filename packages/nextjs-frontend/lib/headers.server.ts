import "server-only";
import { headers } from "next/headers";

/**
 * Retrieves the host from the headers.
 *
 * IMPORTANT: Use it in the server-side only.
 *
 * Note: In the future, instead of using this, we might prefer
 * to use the solution found in the following issue:
 * https://github.com/sst/ion/issues/135
 *
 * @returns The host value from the headers.
 * @throws {Error} If the host header is not found.
 */
export function getHost() {
	const headerList = headers();
	const host = headerList.get("host");

	if (!host) {
		throw new Error("Host header not found");
	}

	const isDev = process.env.NODE_ENV !== "production";

	return isDev ? `http://${host}` : `https://${host}`;
}
