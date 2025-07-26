import { Request, Response } from "express";
import { revokeRefreshToken } from "../../db/queries/reftokens.js";
import { getBearerToken } from "../../middlewares/bearertoken.js";

export async function handlerRevoke(req: Request, res: Response) {
	await revokeRefreshToken(getBearerToken(req));

	res.sendStatus(204);
}
