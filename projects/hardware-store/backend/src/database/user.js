import crypto from 'node:crypto';
import { BadReqError, promisify } from '#root/utils.js';
import { db } from "./core.js";
import { SqliteError } from 'better-sqlite3';

const pbkdf2 = promisify(crypto.pbkdf2);

const stmts = {
    add: db.prepare("INSERT INTO users (name, passwordSalt, passwordHash) VALUES (@name, @salt, @hash)"),
    getByName: db.prepare("SELECT id, passwordSalt as salt, passwordHash as hash FROM users WHERE name = @name")
};

async function createSalt() {
    return crypto.randomBytes(16).toString("hex");
}

async function saltAndHash(salt, password) {
    return await pbkdf2(password, salt, 100000, 64, "sha512");
}

// Tries to insert a user into the database, returning its new id if successful.
async function insertUserRow(name, salt, hash) {
    try {
        const result = stmts.add.run({ name, salt, hash });
        return result.lastInsertRowId;
    } catch (e) {
        if (
            e instanceof SqliteError &&
            e.code === "SQLITE_CONSTRAINT_UNIQUE" &&
            e.message === "UNIQUE constraint failed: users.name"
        ) {
            throw new BadReqError("Already existing user");
        }
        console.error("An error appeared when registering new user.");
        throw e;
    }
}

// Tries to create a new user, returning its id if successful.
export async function createNewUser(name, password) {
    const salt = await createSalt();
    const hash = await saltAndHash(salt, password);

    return await insertUserRow(name, salt, hash);
}

// Returns whether the password matches with the stored salt and hash.
async function verifyPassword(storedSalt, storedHash, password) {
    const resultHash = await saltAndHash(storedHash, password);
    return resultHash === storedHash;
}

export async function verifyUser(name, password) {
    const dbResult = stmts.getByName.get({ name });
    if (dbResult == undefined) {
        throw new BadReqError("Invalid credentials");
    }

    const { id, salt, hash } = dbResult;
    const valid = verifyPassword(salt, hash, password);
    if (!valid) {
        throw new BadReqError("Invalid credentials");
    }

    return id;
}

