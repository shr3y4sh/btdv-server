import { NextFunction, Request, Response } from "express";

export function middlewareLogResponses(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { method, url } = req;

	res.on("finish", () => {
		const { statusCode } = res;

		if (statusCode >= 400) {
			console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
		}
	});

	next();
}
