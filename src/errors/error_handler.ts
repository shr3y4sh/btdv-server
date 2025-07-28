import { NextFunction, Request, Response } from "express";
import {
	ApiKeyNotFoundError,
	ForbiddenError,
	InvalidTokenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "./error.js";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	console.log(err);

	if (err instanceof ValidationError) {
		res.status(400).json({ error: "Chirp is too long. Max length is 140" });
		return;
	}

	if (err instanceof UnauthorizedError) {
		let error = "Incorrect email or password";

		if (err instanceof InvalidTokenError) {
			error = "Invalid/expired token";
		}

		if (err instanceof ApiKeyNotFoundError) {
			error = "Api key invalid/not found";
		}

		res.status(401).json({ error });
		return;
	}

	if (err instanceof ForbiddenError) {
		res.status(403).json({ error: "Forbidden" });
		return;
	}

	if (err instanceof NotFoundError) {
		res.status(404).json({ error: "Not Found" });
		return;
	}

	res.status(500).json({ error: "Something went wrong on our end" });
};
