import { Request, Response } from "express";
import {
	findChirpById,
	getAllChirps,
	getChirpsByAuthor,
} from "../../db/queries/chirps.js";
import { NewChirp } from "../../schema.js";
import { NotFoundError } from "../../errors/error.js";

export async function handlerGetChirps(
	req: Request,
	res: Response<Array<NewChirp>>
) {
	const authorId = req.query["authorId"];

	const sortVal = req.query["sort"];

	let chirps: NewChirp[];

	if (typeof authorId === "string") {
		chirps = await getChirpsByAuthor(authorId);
	} else {
		chirps = await getAllChirps();
	}

	if (sortVal === "desc") {
		chirps.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
	} else {
		chirps.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
	}

	res.status(200).json(chirps);
}

export async function handlerGetChirpById(
	req: Request,
	res: Response<NewChirp>
) {
	const chirpId = req.params["id"];

	const chirp = await findChirpById(chirpId);

	if (!chirp) {
		throw new NotFoundError("Chirp not found");
	}

	res.status(200).json(chirp);
}
