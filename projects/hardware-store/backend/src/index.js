import express from 'express';
import { database } from "./db.js";

const app = express();
const port = 3000;

app.get("/products", async (req, res) => {
    const products = await database.getProducts();
    res.json(products);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
