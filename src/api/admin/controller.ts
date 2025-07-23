import { Request, Response } from "express";
import { config } from "../../config/config.js";
import { deleteAllUsers } from "../../db/queries/users.js";

export function handlerMetrics(_req: Request, res: Response) {
	const hits = config.fileServerHits;

	res.set("Content-Type", "text/html; charset=utf-8");

	res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${hits} times!</p>
  </body>
</html>`);
}

export async function handlerReset(_req: Request, res: Response) {
	config.fileServerHits = 0;

	if (config.platform !== "dev") {
		throw new Error("");
	}

	await deleteAllUsers();

	res.sendStatus(200);
}
