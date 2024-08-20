/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "nextjs-sst-ion-auth",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "aws",
		};
	},
	async run() {
		const auth = await import("./infra/auth");
		const frontend = await import("./infra/frontend");

		return {
			frontend: frontend.frontend.url,
			auth: auth.auth.authenticator.url,
		};
	},
});
