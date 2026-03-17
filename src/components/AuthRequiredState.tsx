import { Link } from "@tanstack/react-router";
import { Github, LogIn, User } from "lucide-react";
import { useAppAuth } from "../hooks/useAppAuth";

export function AuthRequiredState(props: {
	title: string;
	description: string;
}) {
	const { signIn } = useAppAuth();

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
			<div className="max-w-md text-center">
				<User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-white mb-2">{props.title}</h2>
				<p className="text-gray-400 mb-6">{props.description}</p>
				<div className="flex flex-col gap-3">
					<button
						type="button"
						onClick={() =>
							void signIn("github", { redirectTo: window.location.pathname })
						}
						className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors"
					>
						<Github size={18} />
						Continue with GitHub
					</button>
					<button
						type="button"
						onClick={() => void signIn("anonymous")}
						className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
					>
						<LogIn size={18} />
						Continue as Guest
					</button>
					<Link
						to="/"
						className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
					>
						Go Home
					</Link>
				</div>
			</div>
		</div>
	);
}
