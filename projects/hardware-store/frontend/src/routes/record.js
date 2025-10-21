import { NormalViewRoute } from "./utils.js";

const recordedEndpoints = [
	new NormalViewRoute("/", "home", "Hello main page"),
	new NormalViewRoute("/login", "login", "Log-in page", {
		dataFn: (_) => ({
			CSSFiles: ["login_signup"],
			scriptFiles: ["/scripts/login.js"]
		})
	}),
	new NormalViewRoute("/signup", "signup", "Sign-up page", {
		dataFn: (_) => ({
			CSSFiles: ["login_signup"],
			scriptFiles: ["/scripts/signup.js"]
		})
	}),
];

export { recordedEndpoints };
