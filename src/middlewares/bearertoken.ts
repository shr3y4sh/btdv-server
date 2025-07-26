import { Request } from "express";
import { UnauthorizedError } from "../errors/error.js";

export function getBearerToken(req: Request) {
	const authentication = req.headers["authorization"];

	if (!authentication) {
		throw new UnauthorizedError("Bearer token missing");
	}

	const [bearer, token] = authentication.split(" ", 2);

	if (bearer !== "Bearer" || typeof token !== "string") {
		throw new UnauthorizedError("Invalid bearer token");
	}

	return token;
}
