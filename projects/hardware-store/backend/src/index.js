import express from 'express';
import { productDb } from "./database/product.js";
import { createRestAPIRouter } from './api.js';
import { assertString } from './utils.js';

const app = express();
const port = 3000;

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
