import { Router } from "express";
import { recordedEndpoints } from "./record.js";

const router = Router();

for (const endpoint of recordedEndpoints) {
	endpoint.setRoute(router);
}

export { router };
