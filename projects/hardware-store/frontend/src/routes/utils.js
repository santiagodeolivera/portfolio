function getBaseData(req) {
	return {
		urlEncodedPath: encodeURIComponent(req.path),
		CSSFiles: [],
		scriptFiles: [],
		navLinks: [
			{txt: "Log in", href: "/login"},
			{txt: "Sign up", href: "/signup"}
		]
	};
}

const fileNameRegExp = /^[a-zA-Z0-9-_]+$/;
function verifyData(data) {
	if (!Array.isArray(data.CSSFiles)) {
		throw new Error();
	}
	
	for (const v of data.CSSFiles) {
		if (typeof v !== "string") {
			throw new Error();
		}
		
		if (!fileNameRegExp.test(v)) {
			const quoted = JSON.stringify(v);
			throw new Error(`Invalid file name for regexp /^[a-zA-Z0-9-_]+$/: ${quoted}`);
		}
	}
}

const defaultDataFn = (_) => ({});
function renderEndpoint(template, title, dataFn) {
	dataFn ??= defaultDataFn;
	
	return (req, res) => {
		const data = {
			...getBaseData(req),
			...dataFn(req),
			title,
		};
		
		verifyData(data);
		
		res.render(template, data);
	}
}

/*

interface Route {
	setRoute(router: Router) -> void;
}

*/

class NormalViewRoute {
	constructor(path, template, title, {dataFn, middlewares} = {}) {
		this.path = path;
		this.middlewares = middlewares ?? [];
		this.fn = renderEndpoint(template, title, dataFn);
	}
	
	setRoute(router) {
		router.get(this.path, ...this.middlewares, this.fn);
	}
}

export { NormalViewRoute };
