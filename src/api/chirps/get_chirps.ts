import { Request, Response } from "express";
import { findChirpById, getAllChirps } from "../../db/queries/chirps.js";
import { NewChirp } from "../../schema.js";
import { NotFoundError } from "../../errors/error.js";

export async function handlerGetChirps(
	_req: Request,
	res: Response<Array<NewChirp>>
) {
	const chirps = await getAllChirps();

	res.status(200).json(chirps);
	res.end();
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
