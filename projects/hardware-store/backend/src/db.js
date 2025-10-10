import SqliteDatabase from 'better-sqlite3';
import { env } from './env.js';

const db = SqliteDatabase(env["db-path"]);

class Database {
    constructor() {
    }

    async getProducts() {
        const stmt = db.prepare("SELECT id, name FROM products");
        const result = stmt.all();
        return result.map(({id, name}) => ({id, name}));
    }
}

export const database = new Database();
