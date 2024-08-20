import { makeURL } from "@nauverse/make-url";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../../components/ui/button";
import { getHost } from "../../lib/headers.server";
import { validateSession } from "../../lib/session.server";

export default async function LoginPage() {
	const sessionData = await validateSession();
	const host = getHost();

	if (sessionData.isValid && sessionData.user) {
		return redirect(makeURL(host, "protected"));
	}

	const githubSignInURL = makeURL(
		// biome-ignore lint/style/noNonNullAssertion: We are sure that this env var is set
		process.env.NEXT_PUBLIC_AUTH_URL!,
		"github/authorize",
		{
			params: {
				client_id: "local", // You can set anything here but make sure to set the same "client_id" in the callback (api/auth/github/callback)
				redirect_uri: makeURL(host, "api/auth/github/callback"), // This must be set to the callback URL
				response_type: "code", // Important to set this as "code" so we receive the code in the callback as a query parameter
				provider: "github",
			},
		},
	);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Login
			</h1>
			<section className="flex flex-row items-center justify-center gap-4">
				<Button asChild>
					<Link href={githubSignInURL}>Continue with GitHub</Link>
				</Button>
			</section>
		</main>
	);
}
