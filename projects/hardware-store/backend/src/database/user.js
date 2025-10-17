import crypto from 'node:crypto';
import { promisify } from '#root/utils.js';
import { db } from "./core.js";

const pbkdf2 = promisify(crypto.pbkdf2);

const stmts = {
    add: db.prepare("INSERT INTO users (name, salt, hash) VALUES (@name, @salt, @hash)")
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
        stmts.add.run({ name, salt, hash });
        return true;
    } catch (e) {
        console.error("An error appeared when registering new user.");
        return false;
    }
}

// Tries to create a new user, returning true or false according to success or failure
export async function createNewUser(name, password) {
    const salt = await createSalt();
    const hash = await saltAndHash(salt, password);

    return insertUserRow(name, salt, hash);
}

// Returns true if the password matches with the stored salt and hash. Otherwise, returns false
export async function verifyPassword(storedSalt, storedHash, password) {
    const resultHash = await saltAndHash(storedHash, password);
    return resultHash === storedHash;
}
