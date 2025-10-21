/*

How to abstract database access?
Possible solutions:
    A generic database that supports all CRUD operations
    Individual functions
    An express router that supports all CRUD operations

*/

import SqliteDatabase from 'better-sqlite3';
import { env } from '../env.js';

export const db = SqliteDatabase(env["db-path"]);

export class GenericDatabase {
    #stmts;

    constructor(getStmt, getByIdStmt, addStmt, editStmt, removeStmt) {
        this.stmts = {
            get: db.prepare(getStmt),
            getById: db.prepare(getByIdStmt),
            add: db.prepare(addStmt),
            edit: db.prepare(editStmt),
            remove: db.prepare(removeStmt)
        };
    }

    async get() {
        return this.#stmts.get.all();
    }

    async getById(id) {
        return this.#stmts.getById.get({ id });
    }

    async add(data) {
        this.#stmts.add.run(data);
    }

    async edit(id, data) {
        const res = this.#stmts.edit.run({ ...data, id });
        return res.changes > 0;
    }

    async remove(id) {
        const res = this.#stmts.remove.run({ id });
        return res.changes > 0;
    }
}
