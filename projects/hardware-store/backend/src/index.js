import express from "express";
import expressCors from "cors";
import expressSession from "express-session";
import { productDb } from "./database/product.js";
import { createRestAPIRouter } from './routers/rest-generic.js';
import { router as usersRouter } from "./routers/users.js";
import { assertString, BadReqError } from './utils.js';
import { env } from './env.js';

const app = express();
const port = 3000;

app.use(expressCors());

app.use(expressSession({
	secret: env["session-secret"],
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 30 * 60 * 1000
	}
}));

app.use(express.json());

app.use(usersRouter);

const productsRouter = createRestAPIRouter(productDb, (body) => ({ name: assertString(body.name)}));
app.use("/products", productsRouter);

app.use((err, req, res, next) => {
	if (err instanceof BadReqError) {
		res.status(400).send(err.message ?? "Bad request");
		return;
	}

    console.error(err);
    res.status(500).send("Internal server error");
});

app.use((req, res) => {
	res.status(404).send("Route not found");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
