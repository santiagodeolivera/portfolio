import { NormalViewRoute } from "./utils.js";

const recordedEndpoints = [
	new NormalViewRoute("/", "main", "Hello main page"),
	new NormalViewRoute("/login", "login", "Login page", {
		dataFn: (_) => ({ otherCSSFiles: ["login"] })
	}),
];

export { recordedEndpoints };
