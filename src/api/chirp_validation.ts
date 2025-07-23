import { Request, Response } from "express";
import { ValidationError } from "../errors/error.js";

export async function handlerChirpValidation(req: Request, res: Response) {
	const reqBody: requestBody = req.body;

	if (reqBody.body.length > 140) {
		throw new ValidationError("Response body too long");
	}

	const stream = reqBody.body.split(" ");

	const profaneWords = ["kerfuffle", "sharbert", "fornax"];

	const cleanedBody = stream
		.map((word: string) =>
			profaneWords.includes(word.toLowerCase()) ? "****" : word
		)
		.join(" ");

	const respBody: responseBody = {
		cleanedBody,
	};

	res.status(200).send(JSON.stringify(respBody));
	res.end();
}

type requestBody = {
	body: string;
};

type responseBody = {
	cleanedBody: string;
};

// type errorBody = {
// 	error: string;
// };
