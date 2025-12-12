import { NormalViewRoute } from "./utils.js";

const recordedEndpoints = [
	new NormalViewRoute("/", "home", "Hello main page", {
		dataFn: (_) => ({
			products: (new Array(5)).fill(null).map((_v, i) => ({name: "A", id: i, img: "", price: 20}))
		})
	}),
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
	new NormalViewRoute("/test", "test", "Testing page", {
		dataFn: (_) => ({
			products: (new Array(5)).fill(null).map((_v, i) => ({name: "A", id: i, img: "", price: 20}))
		})
	})
];

export { recordedEndpoints };
