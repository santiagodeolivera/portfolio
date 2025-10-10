import SqliteDatabase from 'better-sqlite3';
import { env } from './env.js';

const db = SqliteDatabase(env["db-path"]);

class Database {
    constructor() {
        const stmts = {
            getProducts: db.prepare("SELECT id, name FROM products"),
            addProduct: db.prepare("INSERT INTO products (name) VALUES (?)")
        };
    }

    async getProducts() {
        return this.stmts.getProducts.all();
    }

    async addProduct(name) {
        if (typeof name !== "string") {
            throw new Error();
        }

        this.stmts.addProduct.run(name);
    }
}

export const database = new Database();
