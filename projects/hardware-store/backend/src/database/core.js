/*

type DbFunction<I, O, E> = fn(I) -> Result<O, E>;

Possible solutions:
    A generic database that supports all CRUD operations
    Individual functions
    A router that supports all CRUD operations

*/

import SqliteDatabase from 'better-sqlite3';
import { env } from '../env.js';

export const db = SqliteDatabase(env["db-path"]);

export class GenericDatabase {
    constructor(getStmt, getByIdStmt, addStmt, editStmt, removeStmt) {
        this.getStmt = db.prepare(getStmt);
        this.getByIdStmt = db.prepare(getByIdStmt);
        this.addStmt = db.prepare(addStmt);
        this.editStmt = db.prepare(editStmt);
        this.removeStmt = db.prepare(removeStmt);
    }

    async get() {
        return this.getStmt.all();
    }

    async getById(id) {
        return this.getByIdStmt.get({ id });
    }

    async add(data) {
        this.addStmt.run(data);
    }

    async edit(id, data) {
        const res = this.editStmt.run({ ...data, id });
        return res.changes > 0;
    }

    async remove(id) {
        const res = this.removeStmt.run({ id });
        return res.changes > 0;
    }
}
