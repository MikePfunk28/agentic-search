import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function sanitizeNodeOptions(nodeOptions = "") {
	return nodeOptions
		.split(/\s+/)
		.filter(
			(token) =>
				token &&
				!token.startsWith("--inspect") &&
				!token.startsWith("--debug"),
		)
		.join(" ");
}

const env = { ...process.env };
const originalNodeOptions = env.NODE_OPTIONS ?? "";
const sanitizedNodeOptions = sanitizeNodeOptions(originalNodeOptions);

if (sanitizedNodeOptions) {
	env.NODE_OPTIONS = sanitizedNodeOptions;
} else {
	delete env.NODE_OPTIONS;
}

if (originalNodeOptions !== sanitizedNodeOptions) {
	console.log(
		"[dev] Removed debugger flags from NODE_OPTIONS for stable Vite/Workers restarts.",
	);
}

const viteBin = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../node_modules/vite/bin/vite.js",
);

const child = spawn(
	process.execPath,
	[viteBin, "dev", ...process.argv.slice(2)],
	{
		cwd: process.cwd(),
		env,
		stdio: "inherit",
	},
);

child.on("error", (error) => {
	console.error("[dev] Failed to start Vite:", error);
	process.exit(1);
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 0);
});
