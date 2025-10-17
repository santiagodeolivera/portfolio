export function assertString(v) {
    if (typeof v !== "string") {
        throw new Error();
    }

    return v;
}

export function getStringFromObject(obj, key) {
    const res = obj[key];

    if (typeof res !== "string") {
        throw new Error();
    }

    return res;
}

export function getStringFromBody(req, key) {
    return getStringFromObject(req.body, key);
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
