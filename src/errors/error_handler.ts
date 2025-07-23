import { NextFunction, Request, Response } from "express";
import { ForbiddenError, ValidationError } from "./error.js";

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

	if (err instanceof ForbiddenError) {
		res.status(403).json({ error: "" });
		return;
	}

	res.status(500).json({ error: "Something went wrong on our end" });
};
