import { makeURL } from "@nauverse/make-url";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getHost } from "../../../../../lib/headers.server";

// This route handles the callback from the GitHub OAuth flow.
// We do this server-side for extra security, as suggested here: https://github.com/sst/sst/tree/master/packages/sst/src/node/future/auth#ssr-sites
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code"); // The code received from GitHub
	const host = getHost();

	if (code) {
		// biome-ignore lint/style/noNonNullAssertion: We are sure that the environment variable is set
		const checkURL = makeURL(process.env.NEXT_PUBLIC_AUTH_URL!, "token");

		// We must verify the code with the auth lambda so we know the GitHub Auth flow code is valid
		const response = await fetch(checkURL, {
			method: "POST",
			body: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: "local", // You can set anything here but make sure to set the same "client_id" in the login page
				code,
				redirect_uri: makeURL(host, "api/auth/github/callback"), // This I don't think really matters, I set it to this because the object is expecting one but after the promise resolves we just check if the response is ok, we don't use the response nor the redirect_uri
			}),
		});

		if (response.ok) {
			// If our auth lambda verifies the code, we get the access token
			const { access_token } = await response.json();

			// We could create a different flow to do this as a JWT json in the LocalStorage or SessionStorage of the browser, or if we wanted to use this in an API but...
			// Since I want to use this in the Next.js app, I'm going to set a cookie with the access token, I feel like that is even more secure than using LocalStorage or SessionStorage, specially because we can set the cookie to be httpOnly and secure
			const cookieStore = cookies();
			cookieStore.set("auth_token", access_token, {
				path: "/",
				sameSite: "lax", // https://web.dev/articles/samesite-cookie-recipes
				maxAge: 60 * 60 * 24 * 30,
				httpOnly: true, // This is important to prevent users modifying the cookie from the browser
				secure: process.env.NODE_ENV === "production", // This is important to prevent the cookie from being sent over an insecure connection, but in local you usually don't have https so disable it unless it is production
			});

			// Since the cookie is set and the auth token is valid, we can redirect the user to the protected page
			// We could implement some redirection logic here, using some search param (although remember to validate the redirect URL to prevent open redirects) but since this is a basic example I just redirect to the protected page
			return Response.redirect(makeURL(host, "protected"));
		}

		// TODO: Improve error handling
		// return Response.error()
	}

	return Response.error();
}
