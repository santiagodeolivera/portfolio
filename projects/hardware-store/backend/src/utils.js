export function assertString(v) {
    if (typeof v !== "string") {
        throw new Error();
    }

    return v;
}

export function getStringFromObject(obj, key) {
    return assertString(obj[key]);
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

// For functions of structure (..., (err, value) => ...) => ...
export function promisify(fn) {
    return (...args) => new Promise((resolve, reject) => {
        fn(...args, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        })
    })
}
