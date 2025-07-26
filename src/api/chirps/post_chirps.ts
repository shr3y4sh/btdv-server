import { Request, Response } from "express";
import { InvalidTokenError, ValidationError } from "../../errors/error.js";
import { createChirp } from "../../db/queries/chirps.js";
import { NewChirp } from "../../schema.js";
import { getBearerToken } from "../../middlewares/bearertoken.js";
import { validateJWT } from "../../utils/jsonwebtoken.js";
import { config } from "../../config/config.js";

export async function handlerCreateChirp(
	req: Request<any, any, requestBody>,
	res: Response<NewChirp>
) {
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

	const { body } = req.body;

	const cleanBody = validateChirp(body);

	const [chirp] = await createChirp(cleanBody, userId);

	res.status(201).json(chirp);
}

function validateChirp(body: string): string {
	if (body.length > 140) {
		throw new ValidationError("Response body too long");
	}

	const stream = body.split(" ");

	const profaneWords = ["kerfuffle", "sharbert", "fornax"];

	const cleanedBody = stream
		.map((word: string) =>
			profaneWords.includes(word.toLowerCase()) ? "****" : word
		)
		.join(" ");

	return cleanedBody;
}

type requestBody = {
	body: string;
};
