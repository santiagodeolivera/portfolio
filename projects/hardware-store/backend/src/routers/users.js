import { createNewUser, verifyUser } from '#root/database/user.js';
import { assertString } from '#root/utils.js';
import { Router } from 'express';

const router = Router();

router.post("/signup", async (req, res) => {
    const name = assertString(req.body.name);
    const password = assertString(req.body.password);

    const newId = await createNewUser(name, password);
    req.session.userId = newId;

    res.status(201).end();
});

router.post("/login", async (req, res) => {
    const name = assertString(req.body.name);
    const password = assertString(req.body.password);

    const userId = await verifyUser(name, password);
    if (!userId.success) {
        res.status(400).send(userId.value);
        return;
    }
    
    req.session.userId = userId.value;
    res.status(200).end();
});
