import { auth } from "./auth";

export const frontend = new sst.aws.Nextjs("Frontend", {
	path: "packages/nextjs-frontend",
	link: [auth], // We need to link the auth or we won't be able to access the session function to verify the user
	environment: {
		NEXT_PUBLIC_AUTH_URL: auth.authenticator.url, // I would rather use the auth URL from the authenticator handler by obtaining it from the linked auth but I don't know how to do it yet so this is a workaround
	},
});
