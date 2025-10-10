import env from "#local/env.json" with { type: 'json' };

if (typeof env !== "object") {
    throw new Error("Invalid environment variables (#503)");
}

if (typeof env["db-path"] !== "string") {
    throw new Error("Invalid environment variables (#955)");
}

export { env };
