'use strict';

import express from "express";
import expressSession from "express-session";
import expressHandlebars from "express-handlebars";
import path from "path";
import { getData } from "./vars.js";
import { router as mainRouter } from "./routes/index.js";
import { env } from "#root/env.js";

const { __dirname } = getData(import.meta.url);

// TODO: Set favicon.ico
// TODO: Remove session data, if necessary

const app = express();
const hbs = expressHandlebars.create({
	helpers: {
		concat: (...args) => {
			args.pop();
			
			for (const v of args) {
				if (typeof v != "string") {
					const str = JSON.stringify(typeof v);
					throw new Error(`Expected a list of strings, but one of them is of type ${str}`);
				}
			}
			
			return args.join("");
		},
		required: (value, name) => {
			if (value == undefined) {
				throw new Error(`Missing required value: ${name}`);
			}
			
			return value;
		},
		or: (value, _default) => (value == undefined ? _default : value)
	}
});
const port = 3000;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use("/__local", express.static(path.join(__dirname, '__local-public')));

app.use(mainRouter);

const environ = process.env.NODE_ENV || "development";
if (environ === "development") {
	app.use("/test", async (req, res) => {
		const response = await fetch(env["backend-url"]);
		const text = await response.text();
		res.send(text);
	});
}

app.use((err, req, res, next) => {
	res.status(500);
	console.error(err);
	res.send("Internal server error"); 
});

app.use((req, res) => {
	res.status(404).send("Route not found");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
