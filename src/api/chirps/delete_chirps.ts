import { Request, Response } from "express";
import { getBearerToken } from "../../middlewares/bearertoken.js";
import { validateJWT } from "../../utils/jsonwebtoken.js";
import { config } from "../../config/config.js";
import {
	ForbiddenError,
	InvalidTokenError,
	NotFoundError,
} from "../../errors/error.js";
import { deleteChirp, findChirpById } from "../../db/queries/chirps.js";

export async function handlerDeleteChirp(req: Request, res: Response) {
	const chirpId = req.params["id"];

	const token = getBearerToken(req);

	let userId;

	try {
		userId = validateJWT(token, config.jwtSecret);
	} catch (err) {
		console.error(err);
		throw new InvalidTokenError("Invalid/expired JWT token");
	}

	if (!userId) {
		throw new InvalidTokenError("userId invalid");
	}

	const chirpObject = await findChirpById(chirpId);

	if (!chirpObject) {
		throw new NotFoundError("Chirp not found");
	}

	if (userId !== chirpObject.userId) {
		throw new ForbiddenError("User not the owner of the chirp");
	}

	await deleteChirp(chirpId);

	res.sendStatus(204);
}
