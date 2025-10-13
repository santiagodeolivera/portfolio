import express from 'express';
import { productDb } from "./database/product.js";
import { createRestAPIRouter } from './api.js';
import { getStringFromObject } from './utils.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use(createRestAPIRouter(productDb, (body) => ({
    name: getStringFromObject(body, "name")
})));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal server error");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
