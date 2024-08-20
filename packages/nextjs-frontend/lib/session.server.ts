import "server-only";
import { session } from "@nextjs-sst-ion-auth/functions/src/sessions";
import { cookies } from "next/headers";

/**
 * Validates the session by checking if the authentication token is present and valid.
 *
 * IMPORTANT: This function should be used in the server-side only.
 *
 * @returns A promise that resolves to an object with the following properties:
 * - `isValid`: A boolean indicating whether the session is valid or not.
 * - `user`: An optional object containing the user's email if the session is valid.
 */
export async function validateSession(): Promise<{
	isValid: boolean;
	user?: {
		email: string;
	};
}> {
	try {
		const cookieStore = cookies();

		// Make sure the cookie name is the same as the one set at the login callback (api/auth/github/callback)
		const auth_token = cookieStore.get("auth_token")?.value;

		if (!auth_token) {
			return {
				isValid: false,
			};
		}

		const sessionVerificationData = await session.verify(auth_token);

		if (sessionVerificationData.type !== "user") {
			return {
				isValid: false,
			};
		}

		return {
			isValid: true,
			user: {
				email: sessionVerificationData.properties.email,
			},
		};
	} catch (err) {
		// TODO: Log the error
		return {
			isValid: false,
		};
	}
}
