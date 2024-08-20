"use server";

import { cookies } from "next/headers";
import { getHost } from "../lib/headers.server";

export async function logout() {
	const cookieStore = cookies();
	const host = getHost();

	// We could verify the user is logged in but...
	// We just try to delete the cookie
	// Just make sure the cookie delete has the same name as the cookie set at
	// the login callback (api/auth/github/callback)
	cookieStore.delete("auth_token");
}
