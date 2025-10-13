import { db } from './db.js';

const stmts = {
    getProducts: db.prepare("SELECT id, name FROM products"),
    getProductById: db.prepare("SELECT name FROM products WHERE id = @id"),
    addProduct: db.prepare("INSERT INTO products (name) VALUES (@name)"),
    editProduct: db.prepare("UPDATE products SET name = @name WHERE id = @id"),
    deleteProduct: db.prepare("DELETE FROM products WHERE id = @id")
};

class Database {
    async getProducts() {
        return stmts.getProducts.all();
    }

    async getProductById(id) {
        return stmts.getProductById.get({ id });
    }

    async addProduct(name) {
        stmts.addProduct.run({ name });
    }

    async editProduct(id, newName) {
        const res = stmts.editProduct.run({ id, name: newName });
        return res.changes > 0;
    }

    async deleteProduct(id) {
        const res = stmts.deleteProduct.run({ id });
        return res.changes > 0;
    }
}

export const database = new Database();
