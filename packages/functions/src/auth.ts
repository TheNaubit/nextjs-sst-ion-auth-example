import { Octokit } from "@octokit/core";
import { Resource } from "sst";
import { GithubAdapter, GoogleAdapter } from "sst/auth/adapter";
import { auth } from "sst/aws/auth";
import { session } from "./sessions";

export const handler = auth.authorizer({
	session,
	providers: {
		// In case later on I want to add Google authentication
		// We can add any SSTv2 Auth provider here
		// https://docs.sst.dev/auth#adapters
		//   google: GoogleAdapter({
		//     mode: "oidc",
		//     clientID: Resource.GoogleClientID.value,
		//   }),
		// I decided to use Github for now since it's easier to setup
		github: GithubAdapter({
			clientID: Resource.GithubClientID.value,
			clientSecret: Resource.GithubClientSecret.value,
			scope: "user",
			mode: "oauth",
		}),
	},
	// For more docs about it, use:
	// - https://docs.sst.dev/auth
	// - https://gist.github.com/mattkinnersley/9aa751dc7ea115cdebbe2bf44a068ec7
	// - https://github.com/sst/sst/tree/master/packages/sst/src/node/future/auth
	callbacks: {
		auth: {
			async allowClient(clientID: string, redirect: string) {
				return true;
			},
			async success(ctx, input, req) {
				if (input.provider !== "github" /* && input.provider !== "google"*/) {
					throw new Error("Unknown provider");
				}

				let claims: { email?: string; name?: string } | null = null;

				if (input.provider === "github") {
					// We use the Octokit lib to get the user's email
					const octokit = new Octokit({
						auth: input.tokenset.access_token,
					});

					const { data } = await octokit.request("GET /user/emails", {
						headers: {
							"X-GitHub-Api-Version": "2022-11-28", // Not sure if this is necessary
						},
					});

					const emailData = data?.find((email) => Boolean(email.primary));
					claims = { email: emailData?.email };
				}

				//   if (input.provider === "google") {
				//     claims = input.tokenset.claims();
				//   }

				if (!claims) {
					throw Error("No claims found");
				}

				if (!claims.email) {
					throw Error("No email found");
				}

				const email = claims.email;
				const name = claims?.name ? claims.name : claims.email;

				if (email && name) {
					// Create user here (or check if user exists and get its data)
					// You can access your DB or whatever

					// Then return the session
					return ctx.session({
						type: "user",
						properties: {
							email,
						},
					});
				}

				// If we reach this point, something went wrong
				throw new Error("Unknown provider");
			},
		},
	},
});
