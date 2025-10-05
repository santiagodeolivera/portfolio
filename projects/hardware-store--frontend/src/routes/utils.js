function getBaseData(req) {
	return {
		urlEncodedPath: encodeURIComponent(req.path),
		otherCSSFiles: [],
	};
}

const fileNameRegExp = /^[a-zA-Z0-9-_]+$/;
function verifyData(data) {
	if (!Array.isArray(data.otherCSSFiles)) {
		throw new Error();
	}
	
	if (data.otherCSSFiles.some(v => typeof v !== "string")) {
		throw new Error();
	}
	
	if (data.otherCSSFiles.some(v => !fileNameRegExp.test(v))) {
		throw new Error();
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
