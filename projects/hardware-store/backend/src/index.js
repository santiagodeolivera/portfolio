import express from "express";
import expressCors from "cors";
import expressSession from "express-session";
import { productDb } from "./database/product.js";
import { createRestAPIRouter } from './routers/rest-generic.js';
import { assertString } from './utils.js';
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

const productsRouter = createRestAPIRouter(productDb, (body) => ({ name: assertString(body.name)}));
app.use("/products", productsRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal server error");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
