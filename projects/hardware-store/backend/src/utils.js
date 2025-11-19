export class BadReqError extends Error {}

function refineError(error) {
    if (error == undefined) return new Error();
    if (typeof error === "string") return new Error(error);
    if (typeof error === "function") return error();
    return error;
}

export function assertObject(v, error) {
    if (typeof v !== "object") {
        throw refineError(error);
    }

    return v;
}

export function assertString(v, error) {
    if (typeof v !== "string") {
        throw refineError(error);
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
/**
 * @template {any[]} Args
 * @template E
 * @template V
 * @param {(...args: [...Args, (...a2: [undefined, V] | [E, undefined]) => void])} fn 
 * @returns {(...args: Args) => Promise<V>}
 */
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
