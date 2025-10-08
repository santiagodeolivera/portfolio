import env from "#local/env.json" with { type: 'json' };

if (typeof env !== "object") {
    throw new Error("Invalid environment variables (#397)");
}

if (typeof env["session-secret"] !== "string") {
    throw new Error("Invalid environment variables (#980)");
}

export { env };
