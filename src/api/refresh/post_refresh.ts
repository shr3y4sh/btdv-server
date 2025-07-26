import { Request, Response } from "express";
import { config } from "../../config/config.js";
import { getRefreshToken } from "../../db/queries/reftokens.js";
import { InvalidTokenError } from "../../errors/error.js";
import { getBearerToken } from "../../middlewares/bearertoken.js";
import { makeJWT } from "../../utils/jsonwebtoken.js";

export async function handlerRefresh(req: Request, res: Response) {
	const refreshToken = await getRefreshToken(getBearerToken(req));

	if (!refreshToken) {
		throw new InvalidTokenError("Refresh token unavailable");
	}

	if (refreshToken.expiresAt.getTime() < Date.now()) {
		throw new InvalidTokenError("Refresh token expired");
	}

	if (refreshToken.revokedAt) {
		throw new InvalidTokenError("Refresh token revoked");
	}

	const token = makeJWT(refreshToken.userId, config.jwtSecret);

	res.status(200).json({ token });
}
