import Database from "better-sqlite3";
import { env } from "./env.js";
import fs from "fs";

const dbPath = env["db-path"];

fs.unlinkSync(dbPath);

const db = Database(dbPath);

const commands = [
    ["CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30) NOT NULL)"],
    ["INSERT INTO products (name) VALUES (?)", "A"],
    ["INSERT INTO products (name) VALUES (?)", "B"],
    ["INSERT INTO products (name) VALUES (?)", "C"],
    ["INSERT INTO products (name) VALUES (?)", "D"],
    ["CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30) NOT NULL, salt CHAR(10) NOT NULL, password CHAR(64) NOT NULL)"],
];

for (const [command, ...bindParams] of commands) {
    console.log([command, ...bindParams]);
    const stmt = db.prepare(command).bind(bindParams);
    stmt.run();
}
