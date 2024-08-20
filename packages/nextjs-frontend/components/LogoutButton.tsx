"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "../actions/logout.action";
import { Button } from "./ui/button";

interface LogoutButtonProps {
	className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const logoutAction = async () => {
		startTransition(async () => {
			try {
				await logout();
				router.refresh();
			} catch (err) {
				console.error(err);
			}
		});
	};

	return (
		<Button
			variant={"destructive"}
			className={className}
			disabled={isPending}
			onClick={logoutAction}
		>
			Log out
		</Button>
	);
}
