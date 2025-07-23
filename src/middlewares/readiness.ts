import { NextFunction, Request, Response } from "express";
import { config } from "../config/config.js";

export function handlerReadiness(_req: Request, res: Response) {
	res.set("Content-Type", "text/plain; charset=utf-8");

	res.status(200).send("OK");
}

export function middlewareMetricInc(
	_req: Request,
	_res: Response,
	next: NextFunction
) {
	config.fileServerHits++;
	next();
}
