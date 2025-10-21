import { createNewUser, verifyUser } from '#root/database/user.js';
import { assertObject, assertString, BadReqError } from '#root/utils.js';
import { Router } from 'express';

const invalidCredentialsErrorFn = () => new BadReqError("Invalid credentials");

const router = Router();

function getNameAndPasswordFromBody(req) {
    const body = assertObject(req.body, invalidCredentialsErrorFn);
    const name = assertString(body.username, invalidCredentialsErrorFn);
    const password = assertString(body.password, invalidCredentialsErrorFn);
    return {name, password};
}

router.post("/signup", async (req, res) => {
    const {name, password} = getNameAndPasswordFromBody(req);

    const newId = await createNewUser(name, password);
    req.session.userId = newId;

    res.status(201).end();
});

router.post("/login", async (req, res) => {
    const {name, password} = getNameAndPasswordFromBody(req);

    const userId = await verifyUser(name, password);
    req.session.userId = userId;
    
    res.status(200).end();
});

export { router };
