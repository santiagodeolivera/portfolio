import { db } from '#root/db.js';

const stmts = {
    addUser: db.prepare("INSERT INTO users (name, salt, password) VALUES (@name, @salt, @password)")
};
