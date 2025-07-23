import { Request, Response } from "express";

import { createUser } from "../../db/queries/users.js";
import { NewUser } from "../../schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
	const newUser: NewUser = {
		email: req.body.email,
	};

	const user = await createUser(newUser);

	res.status(201).json(user);
}
