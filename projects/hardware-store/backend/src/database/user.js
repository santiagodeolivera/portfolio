import crypto from 'node:crypto';
import { promisify } from '#root/utils.js';
import { db } from "./core.js";

const pbkdf2 = promisify(crypto.pbkdf2);

const stmts = {
    add: db.prepare("INSERT INTO users (name, salt, hash) VALUES (@name, @salt, @hash)"),
    getByName: db.prepare("SELECT id, salt, hash FROM users WHERE name = @name")
};

async function createSalt() {
    return crypto.randomBytes(16).toString("hex");
}

async function saltAndHash(salt, password) {
    return await pbkdf2(password, salt, 100000, 64, "sha512");
}

// Tries to insert a user into the database, returning true or false according to success or failure
async function insertUserRow(name, salt, hash) {
    try {
        const result = stmts.add.run({ name, salt, hash });
        return result.lastInsertRowId;
    } catch (e) {
        console.error("An error appeared when registering new user.");
        throw e;
    }
}

// Tries to create a new user, returning true or false according to success or failure
export async function createNewUser(name, password) {
    const salt = await createSalt();
    const hash = await saltAndHash(salt, password);

    return await insertUserRow(name, salt, hash);
}

// Returns true if the password matches with the stored salt and hash. Otherwise, returns false
async function verifyPassword(storedSalt, storedHash, password) {
    const resultHash = await saltAndHash(storedHash, password);
    return resultHash === storedHash;
}

export async function verifyUser(name, password) {
    const dbResult = stmts.getByName.get({ name });
    if (dbResult == undefined) {
        return { success: false, value: "Invalid credentials" };
    }

    const { id, salt, hash } = dbResult;
    const valid = verifyPassword(salt, hash, password);
    if (!valid) {
        return { success: false, value: "Invalid credentials" };
    }

    return { success: true, value: id };
}

