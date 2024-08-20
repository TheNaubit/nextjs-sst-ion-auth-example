import { secretGithubClientID, secretGithubClientSecret } from "./secrets";

export const auth = new sst.aws.Auth("Auth", {
	authenticator: {
		streaming: false, // Disabled streaming so it works fine in Safari, as explained here: https://github.com/sst/ion/pull/845
		handler: "packages/functions/src/auth.handler",
		link: [secretGithubClientID, secretGithubClientSecret], // We need to link these secrets or the function handler will not have access to them
	},
});
