import { Request, Response } from "express";
import { ValidationError } from "../../errors/error.js";
import { createChirp } from "../../db/queries/chirps.js";
import { NewChirp } from "../../schema.js";

export async function handlerCreateChirp(
	req: Request<unknown, unknown, requestBody>,
	res: Response<NewChirp>
) {
	const { body, userId } = req.body;

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
	userId: string;
};
