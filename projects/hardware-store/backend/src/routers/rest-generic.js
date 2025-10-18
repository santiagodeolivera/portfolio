import { Router } from 'express';
import { getNumberFromParams } from '#root/utils.js';

function processOptions(options) {
    options ??= {};
    options.middleware ??= {};
    options.middleware.get ??= [];
    options.middleware.getById ??= [];
    options.middleware.add ??= [];
    options.middleware.edit ??= [];
    options.middleware.remove ??= [];
    options.accept ??= {};
    options.accept.get ??= true;
    options.accept.getById ??= true;
    options.accept.add ??= true;
    options.accept.edit ??= true;
    options.accept.remove ??= true;

    return options;
}

/*
Creates a router for the rest API of a concrete resource.

db: The database object to base it into
dataFromBody: A function that safely processes the body to get a resource's info, either to add or edit one.
options:
    middleware: An object containing lists of middlewares for each action.
*/
export function createRestAPIRouter(db, getDataFromBody, options = undefined) {
    options = processOptions(options);

    const router = Router();

    if (options.accept.get) {
        router.get("/", ...options.middleware.get, async (req, res) => {
            const result = await db.get();
            res.json(result);
        });
    }

    if (options.accept.getById) {
        router.get("/:id", ...options.middleware.getById, async (req, res) => {
            const id = getNumberFromParams(req, "id");

            const product = await db.getById(id);

            if (product !== undefined) {
                res.json(product);
            } else {
                res.status(404).end();
            }
        });
    }

    if (options.accept.add) {
        router.post("/", ...options.middleware.add, async (req, res) => {
            const data = getDataFromBody(req.body);

            await db.add(data);

            res.status(201).end();
        });
    }

    if (options.accept.edit) {
        router.put("/:id", ...options.middleware.edit, async (req, res) => {
            const id = getNumberFromParams(req, "id");
            const data = getDataFromBody(req.body);

            const success = await db.edit(id, data);

            if (success) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        });
    }

    if (options.accept.remove) {
        router.delete("/:id", ...options.middleware.remove, async (req, res) => {
            const id = getNumberFromParams(req, "id");
            
            const success = await db.remove(id);

            if (success) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        });
    }

    return router;
}
