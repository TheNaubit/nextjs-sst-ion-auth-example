import Link from "next/link";
import { Button } from "../components/ui/button";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Home
			</h1>
			<section className="flex flex-row items-center justify-center gap-4">
				<Button asChild>
					<Link href="/protected" className="rounded border-pr">
						Dashboard (protected)
					</Link>
				</Button>

				<Button asChild>
					<Link href="/login">Login</Link>
				</Button>
			</section>
		</main>
	);
}
