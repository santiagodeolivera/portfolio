import express from 'express';
import { database } from "./product.js";
import { getNumberFromParams, getStringFromBody } from './utils.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get("/products", async (req, res) => {
    const products = await database.getProducts();
    res.json(products);
});

app.get("/products/:id", async (req, res) => {
    const id = getNumberFromParams(req, "id");

    const product = await database.getProductById(id);

    if (product !== undefined) {
        res.json(product);
    } else {
        res.status(404).end();
    }
});

app.post("/products", async (req, res) => {
    const name = getStringFromBody(req, "name");

    await database.addProduct(name);

    res.status(201).end();
});

app.put("/products/:id", async (req, res) => {
    const id = getNumberFromParams(req, "id");
    const name = getStringFromBody(req, "name");

    const success = await database.editProduct(id, name);

    if (success) {
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

app.delete("/products/:id", async (req, res) => {
    const id = getNumberFromParams(req, "id");
    
    const success = await database.deleteProduct(id);

    if (success) {
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal server error");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
