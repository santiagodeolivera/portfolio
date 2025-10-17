import { GenericDatabase } from "./core.js";

const db = new GenericDatabase(
    "SELECT id, name,  FROM products",
    "SELECT name FROM products WHERE id = @id",
    "INSERT INTO products (name) VALUES (@name)",
    "UPDATE products SET name = @name WHERE id = @id",
    "DELETE FROM products WHERE id = @id"
);
