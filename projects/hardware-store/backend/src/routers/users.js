import { createNewUser } from '#root/database/user.js';
import { assertString } from '#root/utils.js';
import { Router } from 'express';

const router = Router();

router.post("/signup", async (req, res) => {
    const name = assertString(req.body.name);
    const password = assertString(req.body.password);

    await createNewUser(name, password);

    // TODO: Make sure backend remembers registered user

    res.status(201).end();
});

// TODO: POST /login route