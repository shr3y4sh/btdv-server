import { Request } from "express";
import { ApiKeyNotFoundError } from "../errors/error.js";

export function getAPIKey(req: Request) {
	const authData = req.headers["authorization"];

	if (!authData) {
		throw new ApiKeyNotFoundError("Api key not found");
	}

	const [identifier, token] = authData.split(" ");

	if (identifier !== "ApiKey" || token.length === 0) {
		throw new ApiKeyNotFoundError("Invalid Api key format");
	}

	return token;
}
