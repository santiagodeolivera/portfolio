import { NormalViewRoute } from "./utils.js";

const recordedEndpoints = [
	new NormalViewRoute("/", "home", "Hello main page"),
	new NormalViewRoute("/login", "login", "Login page", {
		dataFn: (_) => ({
			CSSFiles: ["login"],
			scriptFiles: ["/scripts/login.js"]
		})
	}),
];

export { recordedEndpoints };
