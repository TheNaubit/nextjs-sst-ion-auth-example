import { makeURL } from "@nauverse/make-url";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../../components/ui/button";
import { getHost } from "../../lib/headers.server";
import { validateSession } from "../../lib/session.server";

export default async function ProtectedPage() {
	const sessionData = await validateSession();
	const host = getHost();

	if (!sessionData.isValid || !sessionData.user) {
		return redirect(makeURL(host, "login"));
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Dashboard
			</h1>
			<section className="">
				<p className="leading-7 [&:not(:first-child)]:mt-6">
					This page is protected, it can be seen only by authenticated users.
				</p>
				<p className="leading-7 [&:not(:first-child)]:mt-6">
					Welcome <b>{sessionData.user.email}</b>!
				</p>
				<Button variant="destructive" asChild className="mt-6">
					<Link
						href={makeURL(host, "/api/auth/logout")}
						className="rounded border-pr"
					>
						Log out
					</Link>
				</Button>
			</section>
		</main>
	);
}
