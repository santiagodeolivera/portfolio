export function getStringFromBody(req, key) {
    const res = req.body[key];

    if (typeof res !== "string") {
        throw new Error();
    }

    return res;
}

export function getNumberFromParams(req, key) {
    const resStr = req.params[key];

    if (typeof resStr !== "string") {
        throw new Error();
    }

    const res = parseInt(resStr, 10);

    if (isNaN(res)) {
        throw new Error();
    }

    return res;
}
